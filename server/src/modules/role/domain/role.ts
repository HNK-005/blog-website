import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum } from 'class-validator';
import { RoleEnum } from '../role.enum';

export class Role {
  @Allow()
  @IsEnum(RoleEnum)
  @ApiProperty({
    enum: RoleEnum,
  })
  id: RoleEnum;

  @Allow()
  @ApiProperty({
    type: String,
    example: 'admin',
  })
  name?: string;
}
