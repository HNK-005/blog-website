import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { MailData } from './interfaces/mail-data.interface';
import { formatDate } from 'src/utils/format-date';
import { AllConfigType } from 'src/config/config.type';
import path from 'path';

@Injectable()
export class MailService {
  private readonly templatePath = ['src', 'modules', 'mail', 'mail-templates'];
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async registerEmail(mailData: MailData<{ otp: string; expiresAt: Date }>) {
    const {
      to,
      data: { otp, expiresAt },
    } = mailData;

    const subject = 'Your OTP Code';

    const templatePath = path.join(
      this.configService.getOrThrow('app.workingDirectory', {
        infer: true,
      }),
      [...this.templatePath, 'send-otp.hbs'].join('/'),
    );

    await this.mailerService.sendMail({
      to,
      subject: subject,
      templatePath: templatePath,
      context: {
        otp,
        expiresAt: formatDate(expiresAt),
      },
    });
  }
}
