import { DatabaseConfig } from 'src/database/config/database-config.type';
import { AppConfig } from './app-config.type';
import { MailConfig } from 'src/modules/mail/config/mail-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  mail: MailConfig;
};
