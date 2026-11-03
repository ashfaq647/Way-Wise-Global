"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getInquiryEmailRecipient, setInquiryStatus } from "@/lib/admin/inquiries";
import { requireAdmin } from "@/lib/auth/session";
import { EmailConfigError, sendEmail } from "@/lib/email/send-email";
import { inquiryEmailSchema } from "@/lib/validations/email";
import { validationFailure } from "@/lib/validations/inquiry";

// Server Actions for the admin panel. They contain no database code: the data layer
// (lib/admin/inquiries.js) does the reads and writes, and checks the admin session first
// (requireAdmin). A Server Action is a public POST endpoint, so that check is what stops
// direct calls without a session: they are redirected to the login page.

// Result shapes (plain objects, safe to send to the browser):
//   { ok: true, status }                                   saved
//   { ok: false, error, formErrors?, fieldErrors? }        invalid input, missing record or DB error
export async function updateInquiryStatus(input) {
  let result;
  try {
    result = await setInquiryStatus(input);
  } catch (error) {
    // let Next.js handle its own control flow (requireAdmin's redirect to the login page)
    unstable_rethrow(error);
    console.error("[admin] updateInquiryStatus failed:", error);
    return { ok: false, error: "The status could not be saved. Please try again." };
  }

  if (!result.ok) {
    if (result.reason === "invalid") return validationFailure(result.error, "Invalid status update.");
    return { ok: false, error: "This inquiry no longer exists." };
  }

  // Re-render every admin page (dashboard stats, list and this detail page) with fresh data
  revalidatePath("/admin", "layout");
  return { ok: true, status: result.status };
}

// Messages for the admin when sending fails. None of them contain settings or server replies.
const EMAIL_FAILED = "The email could not be sent. Please try again in a moment.";
const CANNOT_CONNECT = "Could not connect to the email server. Check the SMTP settings and your internet connection.";
const EMAIL_ERRORS = {
  EAUTH: "The email server rejected the sign-in. Check the SMTP settings in .env.",
  ECONNECTION: CANNOT_CONNECT,
  ESOCKET: CANNOT_CONNECT, // e.g. connection refused
  EDNS: CANNOT_CONNECT, // SMTP_HOST not found
  ETLS: "Could not set up a secure connection with the email server. Check SMTP_PORT and SMTP_SECURE.",
  ETIMEDOUT: "The email server did not respond in time. Please try again.",
  EENVELOPE: "The email server would not accept this recipient address.",
};

// Sends a plain-text email to the person who made an inquiry. The client sends only the
// inquiry ID, subject and message; the recipient is the inquiry's email from the database.
// Result shapes:
//   { ok: true, sent: true }                        accepted by the email server
//   { ok: true, sent: false }                       EMAIL_TRANSPORT=log: nothing was sent
//   { ok: false, error, formErrors?, fieldErrors? } invalid input, missing inquiry, not set up or send failed
export async function sendInquiryEmail(input) {
  try {
    await requireAdmin(); // no valid admin session: redirected to the login page

    const parsed = inquiryEmailSchema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error, "Please check the highlighted fields.");
    const { inquiryId, subject, message } = parsed.data;

    const recipient = await getInquiryEmailRecipient(inquiryId);
    if (!recipient) return { ok: false, error: "This inquiry no longer exists." };

    const { sent } = await sendEmail({ to: recipient.email, subject, text: message });
    return { ok: true, sent };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof EmailConfigError) {
      // variable names only, never their values
      console.error(`[admin] sendInquiryEmail: email is not configured; check ${error.missing.join(", ")} in .env`);
      return { ok: false, error: "Email sending is not set up yet. Add the email settings to .env and restart the server." };
    }
    // Only the error's code and the SMTP command/response code are logged: no message text,
    // addresses or server replies (which can echo them).
    console.error("[admin] sendInquiryEmail failed:", {
      name: error?.name,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
    });
    return { ok: false, error: EMAIL_ERRORS[error?.code] ?? EMAIL_FAILED };
  }
}
