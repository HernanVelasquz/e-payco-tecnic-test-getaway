import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { envs } from '../../../config/environment.config';
import { SendGridMailRepository } from '../../application/ports/emailer-mail.repository';
import { SendGridMailAdapter } from './mailer-mail.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: envs.mail.host,
          port: envs.mail.port,
          secure: false,
          auth: {
            user: envs.mail.auth.user,
            pass: envs.mail.auth.pass
          },
        },
      }),
    })
  ],
  providers: [
    {
      provide: SendGridMailRepository,
      useClass: SendGridMailAdapter,
    },
  ],
  exports: [SendGridMailRepository],
})
export class EmailInfrastructureModule {}
