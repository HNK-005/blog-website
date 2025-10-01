import * as crypto from 'crypto';

export function generateOtp(length = 6) {
  const otp = crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, '0');

  return otp;
}

export function generateDuration(minute = 1) {
  return new Date(Date.now() + minute * 60 * 1000);
}
