// Length limits for emails written in the admin panel. In their own file (no imports) so the
// compose dialog can use them without loading the validation library in the browser.
export const EMAIL_SUBJECT_MAX = 200;
export const EMAIL_MESSAGE_MAX = 10_000;
