// Native HTML patterns use Unicode sets; parentheses and hyphens must be escaped.
export const PHONE_PATTERN = String.raw`[+\(\)0-9\s\-]{8,20}`;
const phoneRegex = new RegExp(`^(?:${PHONE_PATTERN})$`, 'v');
export function validPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return phoneRegex.test(value) && digits.length >= 8 && digits.length <= 15;
}
