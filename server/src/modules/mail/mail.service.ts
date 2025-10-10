import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { MailData } from './interfaces/mail-data.interface';
import { formatDate } from 'src/utils/format-date';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async registerEmail(mailData: MailData<{ otp: string; expiresAt: Date }>) {
    const {
      to,
      data: { otp, expiresAt },
    } = mailData;

    await this.mailerService.sendMail({
      to,
      subject: 'OTP code to verify account',
      templatePath: 'send-otp',
      context: {
        otp,
        expiresAt: formatDate(expiresAt),
        year: new Date().getFullYear(),
      },
    });
  }
}
