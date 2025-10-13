import { User } from '../../../domain/user';
import { UserSchemaClass } from '../entities/user.schema';
import { Role } from 'src/modules/role/domain/role';
import { Status } from 'src/modules/status/domain/status';
import { RoleSchema } from 'src/modules/role/infrastructure/entities/role.schema';
import { StatusSchema } from 'src/modules/status/infrastructure/entities/status.schema';
import { FileMapper } from 'src/modules/file/infrastructure/persistence/mappers/file.mapper';
import { FileSchemaClass } from 'src/modules/file/infrastructure/persistence/entities/file.schema';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.username = raw.username;
    domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.bio = raw.bio;

    if (raw.avatar) {
      domainEntity.avatar = FileMapper.toDomain(raw.avatar);
    } else if (raw.avatar === null) {
      domainEntity.avatar = null;
    }

    if (raw.role) {
      domainEntity.role = new Role();
      domainEntity.role.id = raw.role.id;
    }

    if (raw.status) {
      domainEntity.status = new Status();
      domainEntity.status.id = raw.status.id;
    }

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserSchemaClass {
    const persistenceSchema = new UserSchemaClass();

    let role: Role | undefined;

    let status: Status | undefined;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }

    if (domainEntity.role) {
      role = new RoleSchema();
      role.id = domainEntity.role.id;
      role.name = domainEntity.role.name;
      persistenceSchema.role = role;
    }

    if (domainEntity.status) {
      status = new StatusSchema();
      status.id = domainEntity.status.id;
      status.name = domainEntity.status.name;
      persistenceSchema.status = status;
    }

    if (domainEntity.avatar) {
      const avatar = new FileSchemaClass();
      avatar._id = domainEntity.avatar.id;
      avatar.path = domainEntity.avatar.path;
      persistenceSchema.avatar = avatar;
    }

    persistenceSchema.email = domainEntity.email;
    persistenceSchema.password = domainEntity.password;
    persistenceSchema.provider = domainEntity.provider;
    persistenceSchema.bio = domainEntity.bio;
    persistenceSchema.username = domainEntity.username;
    persistenceSchema.firstName = domainEntity.firstName;
    persistenceSchema.lastName = domainEntity.lastName;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
