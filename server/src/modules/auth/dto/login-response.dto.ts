import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/domain/user';

export class LoginResponseDto {
  @ApiProperty({
    type: () => User,
  })
  user: Omit<User, 'password'>;
}
