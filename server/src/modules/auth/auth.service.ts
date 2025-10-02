import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from '../user/users.service';
import { RoleEnum } from '../role/role.enum';
import { StatusEnum } from '../status/status.enum';
import { VerificationService } from '../verification/verification.service';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { MailService } from '../mail/mail.service';
import { generateDuration, generateOtp } from 'src/utils/generate';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly verification: VerificationService,
    private readonly mail: MailService,
  ) {}

  async register(dto: AuthRegisterLoginDto): Promise<RegisterResponseDto> {
    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
    });

    const { id, email } = user;

    const otp = generateOtp();
    const expiresAt = generateDuration(5);

    await this.verification.create({
      userId: id,
      token: otp,
      expiresAt,
    });

    await this.mail.registerEmail({ to: email, data: { otp, expiresAt } });

    return {
      email,
    };
  }

  async comfirmEmailWithOtp(dto: AuthConfirmEmailDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (
      !user ||
      user?.status?.id?.toString() !== StatusEnum.inactive.toString()
    ) {
      throw new NotFoundException();
    }

    const verification = await this.verification.findByUserId(user.id);

    if (!verification) {
      throw new NotFoundException();
    }

    const now = new Date();

    if (now > verification.expiresAt) {
      throw new BadRequestException('Your OTP has expired');
    }

    const compareOtp = await bcrypt.compare(dto.otp, verification.token);

    if (!compareOtp) {
      throw new BadRequestException('OTP wrong');
    }

    this.verification.deleteById(verification.id);

    user.status.id = StatusEnum.active;

    await this.usersService.update(user.id, user);
  }
}
