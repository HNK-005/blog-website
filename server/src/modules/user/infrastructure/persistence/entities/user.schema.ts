import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { FileSchemaClass } from 'src/modules/file/infrastructure/persistence/document/entities/file.schema';
import { RoleSchema } from 'src/modules/role/infrastructure/entities/role.schema';
import { StatusSchema } from 'src/modules/status/infrastructure/entities/status.schema';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

@Schema({
  collection: 'users',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({
    type: FileSchemaClass,
  })
  avatar?: FileSchemaClass | null;

  @Prop({
    enum: AuthProvidersEnum,
    default: AuthProvidersEnum.email,
    required: true,
  })
  provider: AuthProvidersEnum;

  @Prop({
    type: RoleSchema,
  })
  role: RoleSchema;

  @Prop({
    type: StatusSchema,
  })
  status: StatusSchema;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;
export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
