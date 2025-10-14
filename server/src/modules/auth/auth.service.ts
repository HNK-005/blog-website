import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UserService } from '../user/user.service';
import { RoleEnum } from '../role/role.enum';
import { StatusEnum } from '../status/status.enum';
import { MailService } from '../mail/mail.service';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthProvidersEnum } from './auth-providers.enum';
import { User } from '../user/domain/user';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { AllConfigType } from 'src/config/config.type';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { NullableType } from 'src/utils/types/nullable.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { SessionService } from '../session/session.service';
import type { Response } from 'express';
import { Session } from '../session/domain/session';
import ms from 'ms';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
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

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );

    await this.mailService.registerEmail({
      to: dto.email,
      data: {
        hash,
      },
    });
  }

  async login(
    res: Response,
    dto: AuthEmailLoginDto,
  ): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        message: 'Email not exists',
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
        message: 'Email not active, Please check your mail',
        errors: {
          email: 'notActive',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        message: `Please login with ${user.provider}`,
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

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
      refreshTokenExpires,
    } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    res.cookie('accessToken', jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(tokenExpires),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(refreshTokenExpires),
    });

    return { user };
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

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        message: 'Hash verify invalid',
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.userService.findById(userId);

    if (
      !user ||
      user?.status?.id?.toString() !== StatusEnum.inactive.toString()
    ) {
      throw new NotFoundException('User not found');
    }

    user.status = {
      id: StatusEnum.active,
    };

    await this.userService.update(user.id, user);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.userService.findById(userJwtPayload.id);
  }

  async refreshToken(
    res: Response,
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<void> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.userService.findById(session.user.id);

    if (!user?.role) {
      throw new UnauthorizedException();
    }

    await this.sessionService.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires, refreshTokenExpires } =
      await this.getTokensData({
        id: session.user.id,
        role: {
          id: user.role.id,
        },
        sessionId: session.id,
        hash,
      });

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(tokenExpires),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(refreshTokenExpires),
    });
  }

  async logout(res: Response, data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    await this.sessionService.deleteById(data.sessionId);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const refreshTokenExpiresIn = this.configService.getOrThrow(
      'auth.refreshExpires',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    const refreshTokenExpires = Date.now() + ms(refreshTokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
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
      tokenExpires,
      refreshTokenExpires,
    };
  }
}
