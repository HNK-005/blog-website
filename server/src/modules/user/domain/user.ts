import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { FileType } from 'src/modules/file/domain/file';
import { Role } from 'src/modules/role/domain/role';
import { Status } from 'src/modules/status/domain/status';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  bio?: string;
  avatar?: FileType | null;
  provider: AuthProvidersEnum;
  role?: Role;
  status?: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
