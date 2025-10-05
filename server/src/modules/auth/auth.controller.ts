import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthSendOtpDto } from './dto/auth-resend-otp.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('email/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this.service.register(createUserDto);
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: () => LoginResponseDto,
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseDto> {
    const login = await this.service.login(loginDto);

    res.cookie('accessToken', login.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.cookie('refreshToken', login.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      user: login.user,
    };
  }

  @Post('email/new-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newOtp(@Body() sendOtpDto: AuthSendOtpDto): Promise<void> {
    return this.service.resendOtp(sendOtpDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmailWithOtp(confirmEmailDto);
  }
}
