import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, Max, MaxLength, MinLength } from 'class-validator';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { FileDto } from 'src/modules/file/dto/file.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: AuthProvidersEnum;

  @ApiPropertyOptional({ example: 'John', type: String })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', type: String })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  avatar?: FileDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @MaxLength(200)
  bio?: string;

  @ApiPropertyOptional({ type: () => RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiPropertyOptional({ type: () => StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;
}
