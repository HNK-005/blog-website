import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSchema,
  UserSchemaClass,
} from './infrastructure/persistence/entities/user.shema';
import { UsersService } from './users.service';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [
    // import modules, etc.
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
    PersistenceModule,
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
