import { MailerModule } from "@nestjs-modules/mailer";
import { TestingModule, Test } from "@nestjs/testing";
import { SendGridMailRepository } from "../../../user/application/ports/emailer-mail.repository";
import { EmailInfrastructureModule } from "../../../user/infrastructure/email/emailInfrastructure.module";
import { SendGridMailAdapter } from "../../../user/infrastructure/email/mailer-mail.adapter";

describe('EmailInfrastructureModule', () => {
    let module: TestingModule;
  
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [EmailInfrastructureModule],
      }).compile();
    });
  
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });
  
    it('should provide SendGridMailRepository', () => {
      const sendGridMailRepository = module.get<SendGridMailRepository>(SendGridMailRepository);
      expect(sendGridMailRepository).toBeDefined();
      expect(sendGridMailRepository).toBeInstanceOf(SendGridMailAdapter);
    });
  
    it('should import MailerModule', () => {
      const mailerModule = module.get<MailerModule>(MailerModule);
      expect(mailerModule).toBeDefined();
    });
  });
  