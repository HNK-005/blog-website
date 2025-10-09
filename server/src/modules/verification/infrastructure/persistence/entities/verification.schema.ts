import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserSchemaClass } from 'src/modules/user/infrastructure/persistence/entities/user.schema';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

@Schema({
  collection: 'verifications',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class VerificationSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserSchemaClass.name,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  token: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiresAt: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export type VerificationSchemaDocument =
  HydratedDocument<VerificationSchemaClass>;
export const VerificationSchema = SchemaFactory.createForClass(
  VerificationSchemaClass,
);
