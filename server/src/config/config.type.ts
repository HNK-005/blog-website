import { DatabaseConfig } from 'src/database/config/database-config.type';
import { AppConfig } from './app-config.type';
import { MailConfig } from 'src/modules/mail/config/mail-config.type';
import { AuthConfig } from 'src/modules/auth/config/auth-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  mail: MailConfig;
  auth: AuthConfig;
};
