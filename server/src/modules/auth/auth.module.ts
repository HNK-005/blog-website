import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerificationModule } from '../verification/verification.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UserModule, MailModule, VerificationModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
