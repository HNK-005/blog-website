import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './infrastructure/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { RoleEnum } from '../role/role.enum';
import { StatusEnum } from '../status/status.enum';
import { Role } from '../role/domain/role';
import { Status } from '../status/domain/status';
import { nanoid } from 'nanoid';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async generateUsername(email: string): Promise<string> {
    let username = email.split('@')[0];

    const user = await this.usersRepository.findByUsername(username);

    if (user) {
      const firstFiveCharacter = nanoid().substring(0, 5);
      username += firstFiveCharacter;
    }

    return username;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Do not remove comment below.
    // <creating-property />

    let password: string | undefined = undefined;
    let role: Role | undefined = undefined;
    let status: Status | undefined = undefined;
    const email = createUserDto.email;
    const username = await this.generateUsername(email);

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    if (email) {
      const userObject = await this.usersRepository.findByEmail(email);
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Email already exists',
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    if (createUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: createUserDto.role.id,
      };
    }

    if (createUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: createUserDto.status.id,
      };
    }

    return this.usersRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      username: username,
      password: password,
      avatar: createUserDto.avatar,
      role: role,
      status: status,
      provider: createUserDto.provider ?? AuthProvidersEnum.email,
    });
  }
}
