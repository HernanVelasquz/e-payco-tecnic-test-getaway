import { Injectable } from '@nestjs/common';
import { SendGridMailRepository } from '../../application/ports/emailer-mail.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { envs } from 'src/config';

@Injectable()
export class SendGridMailAdapter implements SendGridMailRepository {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmailWithTemplate(email: string, opt: any): Promise<any> {
    try {
      const result = await this.mailerService.sendMail({
        from: {
          name: 'epayco-bank',
          address: envs.mail.defaultEmailFrom,
        },
        to: email,
        subject: 'Compra a ePayco',
        text: `Posee una compra que realizo por un valor ${opt.discountValue} el codigo de confirmacion es ${opt.codePayment}`,
      });
      return result;
    } catch (error) {
      return false;
    }
  }
}
