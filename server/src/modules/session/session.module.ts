import {
  // common
  Module,
} from '@nestjs/common';

import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { SessionService } from './session.service';

@Module({
  imports: [PersistenceModule],
  providers: [SessionService],
  exports: [SessionService, PersistenceModule],
})
export class SessionModule {}
