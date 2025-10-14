import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { MailData } from './interfaces/mail-data.interface';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async registerEmail(mailData: MailData<{ hash: string }>) {
    const {
      to,
      data: { hash },
    } = mailData;

    const emailConfirmTitle: string = 'Confirm your email';
    const text1: string = 'Hi there';
    const text2: string = 'Thanks for registering at';
    const text3: string =
      'Please confirm your email address to activate your account on';

    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/confirm-email',
    );

    url.searchParams.set('hash', hash);

    await this.mailerService.sendMail({
      to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: 'activation',
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }
}
