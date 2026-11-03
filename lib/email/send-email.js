import "server-only";
import nodemailer from "nodemailer";

// The one place that sends email. Everything else calls sendEmail(); which provider is used
// is decided here from environment variables, so switching from Gmail to another mailbox
// (e.g. support@waywiseglobal.com) or provider is a change to .env, not to the code.
//
//   EMAIL_TRANSPORT=smtp   send through an SMTP server (Gmail, Google Workspace, any host)
//   EMAIL_TRANSPORT=log    send nothing; log only that an email would have been sent
//   (not set)              email is not set up: sending fails with EmailConfigError
//
// SMTP settings (all from .env, never in code):
//   SMTP_HOST, SMTP_PORT (default 465), SMTP_SECURE ("true" = TLS from the start; default
//   true for port 465), SMTP_USER, SMTP_PASSWORD, EMAIL_FROM, EMAIL_REPLY_TO (optional)
//
// Nothing sensitive is logged: no passwords, no message text, and recipients only masked.
// Server-only: this module (and the credentials it reads) never reaches the browser.

// Missing or invalid settings. `missing` holds variable NAMES only, never values.
export class EmailConfigError extends Error {
  constructor(missing) {
    super(`Email is not configured (${missing.join(", ")})`);
    this.name = "EmailConfigError";
    this.missing = missing;
  }
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1"];

// "a•••@gmail.com" – enough to recognise a log line, not enough to identify someone
export function maskEmail(address) {
  const [user = "", domain = ""] = String(address).split("@");
  return `${user.slice(0, 1)}•••@${domain}`;
}

function readConfig() {
  const env = process.env;
  const transport = (env.EMAIL_TRANSPORT ?? "").trim().toLowerCase();
  if (transport === "log") return { transport };
  if (transport !== "smtp") throw new EmailConfigError(["EMAIL_TRANSPORT"]);

  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_FROM"];
  const missing = required.filter((name) => !env[name]?.trim());
  const port = env.SMTP_PORT?.trim() ? Number(env.SMTP_PORT) : 465;
  if (!Number.isInteger(port) || port < 1 || port > 65535) missing.push("SMTP_PORT");
  if (missing.length) throw new EmailConfigError(missing);

  const host = env.SMTP_HOST.trim();
  const secure = env.SMTP_SECURE?.trim() ? env.SMTP_SECURE.trim().toLowerCase() === "true" : port === 465;
  return {
    transport,
    smtp: {
      host,
      port,
      secure,
      // Without TLS from the start (port 587), insist on upgrading with STARTTLS so the
      // password is never sent unencrypted. Only a mail catcher on this machine may skip it.
      requireTLS: !secure && !LOCAL_HOSTS.includes(host),
      tls: { minVersion: "TLSv1.2" },
      auth: { user: env.SMTP_USER.trim(), pass: env.SMTP_PASSWORD },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    },
    from: env.EMAIL_FROM.trim(),
    replyTo: env.EMAIL_REPLY_TO?.trim() || undefined,
  };
}

// Sends one plain-text email. Returns { sent: true } when the server accepted it, or
// { sent: false } in log mode. Throws EmailConfigError when email isn't set up, and the
// transport's error (with a `code` such as EAUTH or ECONNECTION) when sending fails.
export async function sendEmail({ to, subject, text }) {
  const config = readConfig();

  if (config.transport === "log") {
    console.info(
      `[email] EMAIL_TRANSPORT=log: not sent (to ${maskEmail(to)}, subject ${subject.length} chars, message ${text.length} chars)`,
    );
    return { sent: false };
  }

  const transporter = nodemailer.createTransport(config.smtp);
  try {
    await transporter.sendMail({ from: config.from, replyTo: config.replyTo, to, subject, text });
    return { sent: true };
  } finally {
    transporter.close();
  }
}
