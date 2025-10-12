import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import databaseConfig from './database/config/database.config';
import mailConfig from './modules/mail/config/mail.config';
import appConfig from 'src/config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { MailModule } from './modules/mail/mail.module';
import authConfig from './modules/auth/config/auth.config';
import fileConfig from './modules/file/config/file.config';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, mailConfig, authConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    AuthModule,
    UserModule,
    MailerModule,
    MailModule,
    FileModule,
  ],
})
export class AppModule {}
