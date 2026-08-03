export const passwordRequirements = 'Use at least 12 characters with uppercase, lowercase, a number, and a symbol.';

export function validatePassword(password: unknown) {
  if (typeof password !== 'string') return 'Password is required.';
  if (password.length < 12 || password.length > 128) return 'Password must be between 12 and 128 characters.';
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return passwordRequirements;
  }
  return null;
}
