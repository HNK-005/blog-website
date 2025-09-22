import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSchema,
  UserSchemaClass,
} from './infrastructure/entities/user.shema';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UsersDocumentRepository } from './infrastructure/repositories/user.document.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    // import modules, etc.
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersDocumentRepository,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
