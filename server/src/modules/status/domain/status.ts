import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum } from 'class-validator';
import { StatusEnum } from '../status.enum';

export class Status {
  @Allow()
  @IsEnum(StatusEnum)
  @ApiProperty({
    enum: StatusEnum,
  })
  id: StatusEnum;

  @Allow()
  @ApiProperty({
    type: String,
    example: 'active',
  })
  name?: string;
}
