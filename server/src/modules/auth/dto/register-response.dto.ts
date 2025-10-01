import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterResponseDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
