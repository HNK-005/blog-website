import { NullableType } from 'src/utils/types/nullable.type';
import { User } from '../domain/user';
import { DeepPartial } from 'src/utils/types/deep-partial.type';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;
  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;
  abstract findById(id: User['id']): Promise<NullableType<User>>;
  abstract findByUsername(
    username: User['username'],
  ): Promise<NullableType<User>>;
  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;
}
