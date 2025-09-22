import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { Role } from 'src/modules/role/domain/role';
import { RoleSchema } from 'src/modules/role/infrastructure/entities/role.schema';
import { Status } from 'src/modules/status/domain/status';
import { StatusSchema } from 'src/modules/status/infrastructure/entities/status.schema';

export class User {
  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  firstName: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  lastName: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string;

  @ApiProperty({ type: String, required: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({ type: String })
  bio?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty({
    enum: AuthProvidersEnum,
    required: true,
    example: AuthProvidersEnum.email,
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: AuthProvidersEnum;

  @ApiProperty({
    type: () => Role,
  })
  role?: Role;

  @ApiProperty({
    type: () => Status,
  })
  status?: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
