import { Module } from '@nestjs/common';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
})
export class AppModule {}
