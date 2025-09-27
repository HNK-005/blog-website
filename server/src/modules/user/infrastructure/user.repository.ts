import { NullableType } from 'src/utils/types/nullable.type';
import { User } from '../domain/user';

export abstract class UserRepository {
  abstract create(
    data: User,
  ): Promise<User>;
  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;
  abstract findByUsername(
    username: User['username'],
  ): Promise<NullableType<User>>;
}
