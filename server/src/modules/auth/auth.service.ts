import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user.toString(),
      },
      status: {
        id: StatusEnum.inactive.toString(),
      },
    });
  }
}
