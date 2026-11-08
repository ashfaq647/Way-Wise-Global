// Admin password rules. In their own file (no imports) so the browser forms (login, reset
// password) can use them without loading the validation library. Used by the Better Auth
// config (lib/auth/auth.js), lib/validations/auth.js and scripts/manage-admin.mjs.
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

// How long a password reset link stays valid (Better Auth resetPasswordTokenExpiresIn)
export const RESET_LINK_MINUTES = 30;
