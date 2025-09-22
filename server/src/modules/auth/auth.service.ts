import { Injectable } from '@nestjs/common';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from '../user/users.service';
import { RoleEnum } from '../role/role.enum';
import { StatusEnum } from '../status/status.enum';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
    });
  }
}
