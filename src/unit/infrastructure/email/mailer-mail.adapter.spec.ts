import { MailerService } from "@nestjs-modules/mailer";
import { TestingModule, Test } from "@nestjs/testing";
import { SendGridMailAdapter } from "../../../user/infrastructure/email/mailer-mail.adapter";

describe('SendGridMailAdapter', () => {
    let sendGridMailAdapter: SendGridMailAdapter;
    let mailerService: MailerService;
  
    const mockMailerService = {
      sendMail: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SendGridMailAdapter,
          { provide: MailerService, useValue: mockMailerService },
        ],
      }).compile();
  
      sendGridMailAdapter = module.get<SendGridMailAdapter>(SendGridMailAdapter);
      mailerService = module.get<MailerService>(MailerService);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should send an email successfully', async () => {
      const email = 'test@example.com';
      const opt = { discountValue: 100, codePayment: 'ABC123' };
      const mailResponse = { success: true };
  
      mockMailerService.sendMail.mockResolvedValue(mailResponse);
  
      const result = await sendGridMailAdapter.sendEmailWithTemplate(email, opt);
      expect(result).toEqual(mailResponse);
    });
  
    it('should return false when sending email fails', async () => {
      const email = 'test@example.com';
      const opt = { discountValue: 100, codePayment: 'ABC123' };
  
      mockMailerService.sendMail.mockRejectedValue(new Error('Failed to send email'));
  
      const result = await sendGridMailAdapter.sendEmailWithTemplate(email, opt);
  
      expect(mockMailerService.sendMail).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
  