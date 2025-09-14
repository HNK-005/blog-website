import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { StatusSchema } from 'src/modules/statuses/infrastructure/persistence/document/entities/status.schema';
import { RoleSchema } from 'src/modules/roles/infrastructure/persistence/document/entities/role.schema';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  collection: 'user',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    unique: true,
  })
  email: string | null;

  @Prop()
  password?: string;

  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Prop({
    type: String,
    default: null,
  })
  socialId?: string | null;

  @Prop({
    type: String,
  })
  fullName: string | null;

  @Prop({
    type: String,
  })
  photo?: string | null;

  @Prop({
    type: RoleSchema,
  })
  role?: RoleSchema | null;

  @Prop({
    type: StatusSchema,
  })
  status?: StatusSchema;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

UserSchema.index({ 'role._id': 1 });
