import { Verification } from 'src/modules/verification/domain/verification';
import { VerificationSchemaClass } from '../entities/verification.schema';

export class VerificationMapper {
  static toDomain(row: VerificationSchemaClass): Verification {
    const domainEntity = new Verification();
    domainEntity.id = row._id.toString();
    domainEntity.userId = row.userId.toString();
    domainEntity.token = row.token;
    domainEntity.expiresAt = row.expiresAt;
    domainEntity.createdAt = row.createdAt;
    domainEntity.updatedAt = row.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Verification): VerificationSchemaClass {
    const persistence = new VerificationSchemaClass();

    if (domainEntity.id) {
      persistence._id = domainEntity.id;
    }

    persistence.userId = domainEntity.userId;
    persistence.token = domainEntity.token;
    persistence.expiresAt = domainEntity.expiresAt;

    return persistence;
  }
}
