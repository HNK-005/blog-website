import { RoleEnum } from 'src/modules/role/role.enum';
import { User } from '../../../domain/user';
import { UserSchemaClass } from '../entities/user.shema';
import { Role } from 'src/modules/role/domain/role';
import { Status } from 'src/modules/status/domain/status';
import { StatusEnum } from 'src/modules/status/status.enum';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.avatar = raw.avatar;
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserSchemaClass {
    const persistenceSchema = new UserSchemaClass();

    //default role
    let role = new Role();
    role.id = RoleEnum.user;

    //default status
    let status = new Status();
    status.id = StatusEnum.inactive;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }

    if (domainEntity.role) {
      role.id = domainEntity.role.id;
    }

    if (domainEntity.status) {
      status.id = domainEntity.status.id;
    }

    persistenceSchema.email = domainEntity.email;
    persistenceSchema.password = domainEntity.password;
    persistenceSchema.provider = domainEntity.provider;
    persistenceSchema.username = domainEntity.username;
    persistenceSchema.firstName = domainEntity.firstName;
    persistenceSchema.lastName = domainEntity.lastName;
    persistenceSchema.avatar = domainEntity.avatar;
    persistenceSchema.role = role;
    persistenceSchema.status = status;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
