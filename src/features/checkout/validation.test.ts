import { describe, expect, it } from 'vitest';
import { PHONE_PATTERN, validPhone } from './validation';
describe('checkout phone validation', () => {
  it('uses a browser-compatible Unicode-sets pattern', () => {
    const native = new RegExp(`^(?:${PHONE_PATTERN})$`, 'v');
    expect(native.test('+60 (12) 345-6789')).toBe(true);
    expect(native.test('bad-number')).toBe(false);
  });
  it('requires a plausible number of digits even with formatted input', () => {
    expect(validPhone('012 345 6789')).toBe(true);
    expect(validPhone('--------')).toBe(false);
    expect(validPhone('1234567')).toBe(false);
    expect(validPhone('1234567890123456')).toBe(false);
  });
});
