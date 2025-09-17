import {
  AuthProvidersEnum,
  RoleEnum,
  StatusEnum,
} from '@/config/enum';
import { randUserName, randEmail, randUuid, randPassword } from '@ngneat/falso';
import { UserModel } from './mocks/db';

const generateUser = (): UserModel => ({
  _id: randUuid() + '-' + Math.floor(Math.random() * 1000),
  email: randEmail(),
  password: randPassword(),
  fullName: randUserName({ withAccents: false }),
  provider: AuthProvidersEnum.email,
  photo: '',
  role: {
    _id: RoleEnum.admin,
  },
  status: {
    _id: StatusEnum.active,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
});

export const createUser = <T extends Partial<ReturnType<typeof generateUser>>>(
  overrides?: T,
) => {
  return { ...generateUser(), ...overrides };
};
