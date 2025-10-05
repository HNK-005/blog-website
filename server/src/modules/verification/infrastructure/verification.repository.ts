import { NullableType } from 'src/utils/types/nullable.type';
import { Verification } from '../domain/verification';

export abstract class VerificationRepository {
  abstract create(
    data: Omit<Verification, 'id' | 'createdAt' | 'updateAt'>,
  ): Promise<Verification>;

  abstract findByUserId(
    userId: Verification['userId'],
  ): Promise<NullableType<Verification>>;

  abstract findById(
    id: Verification['id'],
  ): Promise<NullableType<Verification>>;

  abstract update(
    id: Verification['id'],
    data: Partial<Omit<Verification, 'id' | 'createdAt' | 'updateAt'>>,
  ): Promise<Verification>;

  abstract deleteById(id: Verification['id']): Promise<any>;
}
