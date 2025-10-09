import {
  // common
  Module,
} from '@nestjs/common';

import { PersistenceModule } from './infrastructure/persistence/document/persistence.module';
import { FileService } from './file.service';
import { FilesLocalModule } from './infrastructure/uploader/local/file.module';

@Module({
  imports: [
    // import modules, etc.
    PersistenceModule,
    FilesLocalModule,
  ],
  providers: [FileService],
  exports: [FileService, PersistenceModule],
})
export class FileModule {}
