import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { FileService } from '../file/file.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    // import modules, etc.
    PersistenceModule,
    FileModule,
  ],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
