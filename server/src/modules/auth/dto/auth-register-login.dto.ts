import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class AuthRegisterLoginDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'email',
  'password',
] as const) {}
