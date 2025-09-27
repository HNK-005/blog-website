import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { Role } from 'src/modules/role/domain/role';
import { Status } from 'src/modules/status/domain/status';

export class User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  bio?: string;
  avatar?: string;
  provider: AuthProvidersEnum;
  role?: Role;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
