import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type FileSchemaDocument = HydratedDocument<FileSchemaClass>;

@Schema({
  collection: 'files',
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FileSchemaClass extends EntityDocumentHelper {
  @Prop()
  path: string;
}

export const FileSchema = SchemaFactory.createForClass(FileSchemaClass);
