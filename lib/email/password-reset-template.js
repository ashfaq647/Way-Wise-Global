import { EMAIL_LOGO_HEIGHT, EMAIL_LOGO_PNG_BASE64, EMAIL_LOGO_WIDTH } from "@/lib/email/brand-logo";

// HTML version of the password reset email (the plain-text version stays in
// password-reset-email.js and is always sent alongside it).
//
// Built for email clients, Gmail first: table layout, inline styles only, no web fonts,
// scripts or external stylesheets, a 600px card that shrinks to the screen on phones.
// The design is dark in both light and dark mode (it sets its own background colours), so
// it reads the same everywhere; `color-scheme` tells clients that support it not to invert it.
// The admin address is wrapped in its own styled link because Gmail otherwise turns it into
// a default blue link.

export const LOGO_CID = "waywise-logo@waywiseglobal";

const BRAND_RED = "#B80100";
const FONT = "'Segoe UI', Helvetica, Arial, sans-serif";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// The logo, attached inline so it shows without loading an image from the internet
export function logoAttachment() {
  return {
    filename: "way-wise-global-logo.png",
    content: Buffer.from(EMAIL_LOGO_PNG_BASE64, "base64"),
    contentType: "image/png",
    cid: LOGO_CID,
    contentDisposition: "inline",
  };
}

// --- Gmail app dark mode protection --------------------------------------------------------
// The Gmail iPhone app in dark mode recolours `background-color`, `bgcolor` and text `color`
// (our dark email turned light, white text dark, the red button salmon) but leaves images
// and `background-image` alone. So:
//  1. bg(): every background also gets a solid-colour gradient of the same colour, which
//     Gmail's apps leave untouched; background-color/bgcolor stay as the fallback.
//  2. blend(): text blocks are wrapped in two elements with a black background and
//     mix-blend-mode screen / difference (styles in <head>, only active inside Gmail through
//     the `u + .body` selector). This is the documented technique for keeping light text
//     light when Gmail darkens it. Without dark mode the two layers change nothing: screen
//     and difference with black leave both the text and the dark background as they are.
// Device behaviour varies between Gmail versions; this is not verified on every client.
const bg = (color) => `background-color:${color}; background-image:linear-gradient(${color},${color});`;

const blend = (content, tag = "div") =>
  `<${tag} class="gmail-screen"${tag === "span" ? ' style="display:inline-block;"' : ""}><${tag} class="gmail-difference"${tag === "span" ? ' style="display:inline-block;"' : ""}>${content}</${tag}></${tag}>`;

export function passwordResetHtml({ name, email, url, minutes }) {
  const safeName = escapeHtml(name || "there");
  const safeEmail = escapeHtml(email);
  const safeUrl = escapeHtml(url);
  const year = new Date().getUTCFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Reset Your Password</title>
<style>
  u + .body .gmail-screen { background:#000000; mix-blend-mode:screen; }
  u + .body .gmail-difference { background:#000000; mix-blend-mode:difference; }
</style>
</head>
<body class="body" style="margin:0; padding:0; ${bg("#050505")} -webkit-text-size-adjust:100%;">
<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">Reset your Way Wise Global admin password. The link expires in ${minutes} minutes.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#050505" style="${bg("#050505")}">
  <tr>
    <td align="center" style="padding:40px 16px; ${bg("#050505")}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

        <tr>
          <td align="center" style="padding:0 0 28px 0;">
            <img src="cid:${LOGO_CID}" width="${EMAIL_LOGO_WIDTH}" height="${EMAIL_LOGO_HEIGHT}" alt="Way Wise Global" style="display:block; width:${EMAIL_LOGO_WIDTH}px; max-width:70%; height:auto; border:0; outline:none; text-decoration:none; font-family:${FONT}; font-size:22px; font-weight:bold; color:#ffffff;">
          </td>
        </tr>

        <tr>
          <td bgcolor="#121316" style="${bg("#121316")} border:1px solid #2a2b30; border-top:4px solid ${BRAND_RED}; border-radius:16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:40px 40px 8px 40px; font-family:${FONT};">
                  ${blend(`<p style="margin:0 0 14px 0; font-size:12px; line-height:18px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#ff4d4d;">Admin Panel</p>
                  <h1 style="margin:0 0 20px 0; font-size:28px; line-height:36px; font-weight:700; color:#ffffff;">Reset Your Password</h1>
                  <p style="margin:0 0 16px 0; font-size:16px; line-height:26px; color:#e9e7e2;">Hello ${safeName},</p>
                  <p style="margin:0 0 28px 0; font-size:16px; line-height:26px; color:#e9e7e2;">We received a request to reset the password for the Way Wise Global admin account <a href="mailto:${safeEmail}" style="color:#ffffff; font-weight:600; text-decoration:none;">${safeEmail}</a>. Select the button below to choose a new password.</p>`)}
                </td>
              </tr>

              <tr>
                <td style="padding:0 40px 28px 40px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="${BRAND_RED}" style="${bg(BRAND_RED)} border-radius:8px;">
                        <a href="${safeUrl}" target="_blank" style="display:inline-block; padding:15px 36px; font-family:${FONT}; font-size:16px; line-height:22px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:8px; letter-spacing:0.3px;">${blend("Reset Password", "span")}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 40px 28px 40px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="#1b1c21" style="${bg("#1b1c21")} border-left:3px solid ${BRAND_RED}; border-radius:6px; padding:14px 18px; font-family:${FONT}; font-size:14px; line-height:22px; color:#e9e7e2;">
                        ${blend(`<strong style="color:#ffffff;">This link expires in ${minutes} minutes</strong> and can be used only once.`)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 40px 28px 40px; font-family:${FONT};">
                  ${blend(`<p style="margin:0 0 8px 0; font-size:14px; line-height:22px; color:#b0b6c0;">Button not working? Copy this link into your browser:</p>
                  <p style="margin:0; font-size:13px; line-height:20px; word-break:break-all;"><a href="${safeUrl}" target="_blank" style="color:#ff4d4d; text-decoration:underline;">${safeUrl}</a></p>`)}
                </td>
              </tr>

              <tr>
                <td style="padding:0 40px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #2a2b30; font-size:0; line-height:0;">&nbsp;</td></tr></table>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 40px 36px 40px; font-family:${FONT};">
                  ${blend(`<p style="margin:0 0 8px 0; font-size:14px; line-height:22px; font-weight:600; color:#ffffff;">Didn't request this?</p>
                  <p style="margin:0; font-size:14px; line-height:22px; color:#b0b6c0;">You can safely ignore this email. Your password stays the same and the link expires on its own. After a password reset, every device signed in to the admin panel is signed out.</p>`)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:28px 24px 0 24px; font-family:${FONT};">
            ${blend(`<p style="margin:0 0 6px 0; font-size:12px; line-height:18px; color:#8b929c;">This is an automated security email from the Way Wise Global admin panel.</p>
            <p style="margin:0; font-size:12px; line-height:18px; color:#8b929c;">&copy; ${year} Way Wise Global. All Rights Reserved.</p>`)}
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
