import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    // import modules, etc.
    PersistenceModule,
  ],
  controllers: [],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
