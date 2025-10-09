import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { FileDto } from 'src/modules/file/dto/file.dto';

export const nameRegex = /^[A-Za-zÀ-ỹ]+(?:[ '-][A-Za-zÀ-ỹ]+)*$/;
export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  provider?: AuthProvidersEnum;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ example: 'John', type: String })
  @Matches(nameRegex)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', type: String })
  @Matches(nameRegex)
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  avatar?: FileDto | null;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiPropertyOptional({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;
}
