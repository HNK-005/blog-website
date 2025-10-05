import * as crypto from 'crypto';
import ms, { StringValue } from 'ms';

export function generateOtp(length = 6) {
  const otp = crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, '0');

  return otp;
}

export function generateDuration(duration: StringValue = '1m') {
  const time = ms(duration);
  return new Date(Date.now() + time);
}
