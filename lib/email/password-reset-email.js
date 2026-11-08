import "server-only";
import { RESET_LINK_MINUTES } from "@/lib/auth/password-rules";
import { prisma } from "@/lib/db";
import { logoAttachment, passwordResetHtml } from "@/lib/email/password-reset-template";
import { EmailConfigError, sendEmail } from "@/lib/email/send-email";

// Per-account limit on reset emails, on top of Better Auth's per-IP limit: at most this many
// reset links per account in the window, so requests from many IPs can't flood the inbox.
// Counted from the reset tokens Better Auth stores (verification rows whose value is the
// user ID; the identifier is hashed). This runs after the response (background task), and
// the reply never changes, so it reveals nothing about whether the address exists.
const RESET_EMAILS_PER_ACCOUNT = 3;
const RESET_EMAIL_WINDOW_MINUTES = 15;

async function resetEmailLimitReached(userId) {
  const since = new Date(Date.now() - RESET_EMAIL_WINDOW_MINUTES * 60 * 1000);
  // includes the token Better Auth created for this request
  const recent = await prisma.verification.count({ where: { value: userId, createdAt: { gte: since } } });
  return recent > RESET_EMAILS_PER_ACCOUNT;
}

// The "reset your password" email, sent by Better Auth's sendResetPassword
// (lib/auth/auth.js) when someone asks for a reset link on /admin/forgot-password.
//
// The link points at our own page, /admin/reset-password?token=…, on BETTER_AUTH_URL (the
// app's own address). Better Auth's default link (/api/auth/reset-password/:token) is not
// used: that endpoint stays blocked in app/api/auth/[...all]/route.js.
//
// Never logged: the token, the link, the recipient address or the message text.

function resetPasswordUrl(token) {
  const base = process.env.BETTER_AUTH_URL?.trim();
  if (!base) throw new EmailConfigError(["BETTER_AUTH_URL"]);
  const url = new URL("/admin/reset-password", base);
  url.searchParams.set("token", token);
  return url.toString();
}

function messageText({ name, email, url }) {
  return [
    `Hello ${name || "there"},`,
    "",
    `We received a request to reset the password of the Way Wise Global admin account ${email}.`,
    "",
    `Choose a new password with this link. It works once and expires in ${RESET_LINK_MINUTES} minutes:`,
    url,
    "",
    "After the password is changed, every device signed in to the admin panel is signed out.",
    "",
    "If you didn't ask for this, ignore this email: your password stays the same and the link expires on its own.",
    "",
    "Way Wise Global",
  ].join("\n");
}

// Sends the email (branded HTML from password-reset-template.js, with the plain text above
// as the fallback; both carry the same link) and waits for the email server to accept it.
// Better Auth runs this as a background task (advanced.backgroundTasks in lib/auth/auth.js),
// i.e. after the response has been sent, so the wait never delays the reply.
// It never throws: failures are logged without any sensitive details (no address, token,
// link or server reply), and nothing about them reaches the visitor.
export async function sendPasswordResetEmail({ user, token }) {
  try {
    if (await resetEmailLimitReached(user.id)) {
      console.warn(
        `[auth] Password reset email not sent: more than ${RESET_EMAILS_PER_ACCOUNT} requests for this account in ${RESET_EMAIL_WINDOW_MINUTES} minutes.`,
      );
      return;
    }
    const url = resetPasswordUrl(token);
    const content = { name: user.name, email: user.email, url };
    const { sent } = await sendEmail({
      to: user.email,
      subject: "Reset Your Way Wise Global Admin Password",
      text: messageText(content),
      html: passwordResetHtml({ ...content, minutes: RESET_LINK_MINUTES }),
      attachments: [logoAttachment()],
    });
    if (!sent) console.warn("[auth] Password reset requested, but EMAIL_TRANSPORT=log: no email was sent.");
  } catch (error) {
    if (error instanceof EmailConfigError) {
      // variable names only, never their values
      console.error(`[auth] Password reset email not sent: email is not configured; check ${error.missing.join(", ")} in .env`);
      return;
    }
    // Only the error's code and the SMTP command/response code: no addresses, links or
    // server replies (which can echo them).
    console.error("[auth] Password reset email failed:", {
      name: error?.name,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
    });
  }
}
