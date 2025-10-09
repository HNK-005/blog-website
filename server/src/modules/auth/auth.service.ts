import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UserService } from '../user/user.service';
import { RoleEnum } from '../role/role.enum';
import { StatusEnum } from '../status/status.enum';
import { VerificationService } from '../verification/verification.service';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { MailService } from '../mail/mail.service';
import { generateDuration, generateOtp } from 'src/utils/generate';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthProvidersEnum } from './auth-providers.enum';
import { User } from '../user/domain/user';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { AllConfigType } from 'src/config/config.type';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import ms from 'ms';
import { AuthSendOtpDto } from './dto/auth-resend-otp.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { AuthUpdateDto } from './dto/auth-update.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly verification: VerificationService,
    private readonly mail: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const user = await this.userService.create({
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

    const otpExpiresIn = this.configService.getOrThrow(
      'auth.confirmEmailExpires',
      {
        infer: true,
      },
    );

    const otp = generateOtp();
    const expiresAt = generateDuration(otpExpiresIn);

    await this.verification.create({
      userId: id,
      token: otp,
      expiresAt,
    });

    await this.mail.registerEmail({ to: email, data: { otp, expiresAt } });
  }

  async login(dto: AuthEmailLoginDto): Promise<{
    token: string;
    refreshToken: string;
    user: User;
  }> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        message: 'User not found',
        errors: {
          email: 'notFound',
        },
      });
    }

    if (
      !user.status ||
      user.status?.id.toString() === StatusEnum.inactive.toString()
    ) {
      throw new UnprocessableEntityException({
        message: 'User not active',
        errors: {
          email: 'notActive',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        message: 'User registered via another provider',
        errors: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        message: 'Password not set',
        errors: {
          password: 'notSet',
        },
      });
    }

    const comparePassword = await bcrypt.compare(dto.password, user.password);

    if (!comparePassword) {
      throw new BadRequestException('Password wrong');
    }

    const { token, refreshToken } = await this.getTokensData({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      refreshToken,
      user,
    };
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = await this.userService.findById(userJwtPayload.id);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        errors: {
          user: 'userNotFound',
        },
      });
    }

    // if (userDto.password) {
    //   if (!userDto.oldPassword) {
    //     throw new UnprocessableEntityException({

    //       errors: {
    //         oldPassword: 'missingOldPassword',
    //       },
    //     });
    //   }

    //   if (!currentUser.password) {
    //     throw new UnprocessableEntityException({

    //       errors: {
    //         oldPassword: 'incorrectOldPassword',
    //       },
    //     });
    //   }

    //   const isValidOldPassword = await bcrypt.compare(
    //     userDto.oldPassword,
    //     currentUser.password,
    //   );

    //   if (!isValidOldPassword) {
    //     throw new UnprocessableEntityException({

    //       errors: {
    //         oldPassword: 'incorrectOldPassword',
    //       },
    //     });
    //   } else {
    //     await this.sessionService.deleteByUserIdWithExclude({
    //       userId: currentUser.id,
    //       excludeSessionId: userJwtPayload.sessionId,
    //     });
    //   }
    // }

    // if (userDto.email && userDto.email !== currentUser.email) {
    //   const userByEmail = await this.userService.findByEmail(userDto.email);

    //   if (userByEmail && userByEmail.id !== currentUser.id) {
    //     throw new UnprocessableEntityException({

    //       errors: {
    //         email: 'emailExists',
    //       },
    //     });
    //   }

    //   const hash = await this.jwtService.signAsync(
    //     {
    //       confirmEmailUserId: currentUser.id,
    //       newEmail: userDto.email,
    //     },
    //     {
    //       secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
    //         infer: true,
    //       }),
    //       expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
    //         infer: true,
    //       }),
    //     },
    //   );

    //   await this.mailService.confirmNewEmail({
    //     to: userDto.email,
    //     data: {
    //       hash,
    //     },
    //   });
    // }

    delete userDto.email;
    delete userDto.oldPassword;

    await this.userService.update(userJwtPayload.id, userDto);

    return this.userService.findById(userJwtPayload.id);
  }

  async resendOtp(dto: AuthSendOtpDto): Promise<void> {
    const user = await this.userService.findByEmail(dto.email);

    if (
      !user ||
      user?.status?.id?.toString() !== StatusEnum.inactive.toString()
    ) {
      throw new NotFoundException();
    }

    const otp = generateOtp();
    const expiresAt = generateDuration(
      this.configService.getOrThrow('auth.confirmEmailExpires', {
        infer: true,
      }),
    );

    const verification = await this.verification.findByUserId(user.id);

    if (verification) {
      await this.verification.update(verification.id, {
        token: otp,
        expiresAt,
      });
    } else {
      await this.verification.create({
        userId: user.id,
        token: otp,
        expiresAt,
      });
    }

    await this.mail.registerEmail({ to: user.email, data: { otp, expiresAt } });
  }

  async confirmEmailWithOtp(dto: AuthConfirmEmailDto) {
    const user = await this.userService.findByEmail(dto.email);

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

    await this.userService.update(user.id, user);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.userService.findById(userJwtPayload.id);
  }

  async refreshToken(
    userJwtPayload: JwtPayloadType,
  ): Promise<{ token: string }> {
    const { id, role } = userJwtPayload;
    const { token } = await this.getTokensData({ id, role });
    return {
      token,
    };
  }

  private async getTokensData(data: { id: User['id']; role: User['role'] }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
    };
  }
}
