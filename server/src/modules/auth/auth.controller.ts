import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/domain/user';
import { NullableType } from 'src/utils/types/nullable.type';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthSendEmailDto } from './dto/auth-send-email';

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
    return this.service.login(res, loginDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @Post('email/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  async send(@Body() confirmEmailDto: AuthSendEmailDto): Promise<void> {
    return this.service.sendEmail(confirmEmailDto.email);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async refresh(@Req() req, @Res({ passthrough: true }) res): Promise<void> {
    return this.service.refreshToken(res, req.user);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  public me(@Req() req): Promise<NullableType<User>> {
    return this.service.me(req.user);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: User,
  })
  public update(
    @Req() req,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(req.user, userDto);
  }
}
