import { RoleSchema } from 'src/modules/role/infrastructure/entities/role.schema';
import { User } from '../../domain/user';
import { UserSchemaClass } from '../entities/user.shema';
import { Role } from 'src/modules/role/domain/role';
import { Status } from 'src/modules/status/domain/status';
import { StatusSchema } from 'src/modules/status/infrastructure/entities/status.schema';
import { RoleEnum } from 'src/modules/role/role.enum';
import { StatusEnum } from 'src/modules/status/status.enum';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.username = raw.username;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.avatar = raw.avatar;

    if (raw.role) {
      domainEntity.role = new Role();
      domainEntity.role.id = raw.role.id;
      domainEntity.role.name = raw.role.name;
    }

    if (raw.status) {
      domainEntity.status = new Status();
      domainEntity.status.id = raw.status.id;
      domainEntity.status.name = raw.status.name;
    }

    if (raw.deletedAt) {
      domainEntity.deletedAt = raw.deletedAt;
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserSchemaClass {
    const persistenceSchema = new UserSchemaClass();
    let role: RoleSchema | undefined = undefined;
    let status: StatusSchema | undefined = undefined;

    if (domainEntity.role) {
      role = new RoleSchema();
      role.id = domainEntity.role.id;
      role.name = RoleEnum[role.id];
    }

    if (domainEntity.status) {
      status = new StatusSchema();
      status.id = domainEntity.status.id;
      status.name = StatusEnum[status.id];
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
