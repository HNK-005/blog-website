import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VerificationSchema,
  VerificationSchemaClass,
} from './entities/verification.schema';
import { VerificationRepository } from '../verification.repository';
import { VerificationDocumentRepository } from './repositories/verification.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VerificationSchemaClass.name, schema: VerificationSchema },
    ]),
  ],
  providers: [
    {
      provide: VerificationRepository,
      useClass: VerificationDocumentRepository,
    },
  ],
  exports: [VerificationRepository],
})
export class PersistenceModule {}
