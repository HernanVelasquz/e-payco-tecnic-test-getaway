import { TestingModule, Test } from '@nestjs/testing';
import { ResponseBuildingModel } from '../../../common/response/responseBuilding';
import { CODE_ERROR } from '../../../common/error/codeError.type';
import { PaymentUseCaseService } from '../../../user/application/use-cases/paymentUse-Case.service';
import { TokenServiceRepository } from '../../../user/application/ports/token-service.repository';
import { HttpServiceRepository } from '../../../user/application/ports/http-service.repository';
import { AttemptControlRepository } from '../../../user/application/ports/attempt-control.repository';
import { SendGridMailRepository } from '../../../user/application/ports/emailer-mail.repository';
import { RegisterPaymentCommands } from '../../../user/application/command/registerPayment.commands';

describe('PaymentUseCaseService', () => {
  let paymentUseCaseService: PaymentUseCaseService;
  let httpServiceRepository: HttpServiceRepository;
  let tokenServiceRepository: TokenServiceRepository;
  let attemptControlRepository: AttemptControlRepository;
  let sendGridMailRepository: SendGridMailRepository;

  const mockHttpServiceRepository = {
    getInformation: jest.fn(),
  };

  const mockTokenServiceRepository = {
    generateToken: jest.fn(),
  };

  const mockAttemptControlRepository = {
    setCache: jest.fn(),
    getCache: jest.fn(),
  };

  const mockSendGridMailRepository = {
    sendEmailWithTemplate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentUseCaseService,
        {
          provide: HttpServiceRepository,
          useValue: mockHttpServiceRepository,
        },
        {
          provide: TokenServiceRepository,
          useValue: mockTokenServiceRepository,
        },
        {
          provide: AttemptControlRepository,
          useValue: mockAttemptControlRepository,
        },
        {
          provide: SendGridMailRepository,
          useValue: mockSendGridMailRepository,
        },
      ],
    }).compile();

    paymentUseCaseService = module.get<PaymentUseCaseService>(
      PaymentUseCaseService,
    );
    httpServiceRepository = module.get<HttpServiceRepository>(
      HttpServiceRepository,
    );
    tokenServiceRepository = module.get<TokenServiceRepository>(
      TokenServiceRepository,
    );
    attemptControlRepository = module.get<AttemptControlRepository>(
      AttemptControlRepository,
    );
    sendGridMailRepository = module.get<SendGridMailRepository>(
      SendGridMailRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('payment', () => {
    it('should return an error if the wallet is not found', async () => {
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: null },
      });

      const result = await paymentUseCaseService.payment(
        new RegisterPaymentCommands('987654321', 100),
      );

      expect(result).toEqual(
        new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_WALLET_NOT_FOUND,
        ),
      );
    });

    it('should return a message if a payment already exists', async () => {
      const typeRequest = 'REQUEST_PAYMENT:987654321';
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { id: 'wallet-1' } },
      });
      mockAttemptControlRepository.getCache.mockResolvedValueOnce(
        'someCacheValue',
      );

      const result = await paymentUseCaseService.payment(
        new RegisterPaymentCommands('987654321', 100),
      );

      expect(result).toEqual(
        new ResponseBuildingModel(
          true,
          'Existe un pago pendiente, por favor valide su correo',
        ),
      );
    });

    it('should create a new payment request and send an email', async () => {
      const typeRequest = 'REQUEST_PAYMENT:987654321';
      const mockToken = 'token123';
      const mockUser = { email: 'user@example.com' };
      const mockEmailResponse = { success: true };

      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { id: 'wallet-1' } },
      });
      mockAttemptControlRepository.getCache.mockResolvedValueOnce(null);
      mockTokenServiceRepository.generateToken.mockResolvedValueOnce(mockToken);
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: mockUser },
      });
      mockSendGridMailRepository.sendEmailWithTemplate.mockResolvedValueOnce(
        mockEmailResponse,
      );

      const result = await paymentUseCaseService.payment(
        new RegisterPaymentCommands('987654321', 100),
      );

      expect(result).toEqual(
        new ResponseBuildingModel(true, mockEmailResponse),
      );
      expect(mockAttemptControlRepository.setCache).toHaveBeenCalledWith(
        typeRequest,
        JSON.stringify({ token: mockToken, payment: 100 }),
      );
      expect(
        mockSendGridMailRepository.sendEmailWithTemplate,
      ).toHaveBeenCalledWith(mockUser.email, {
        discountValue: 100,
        codePayment: mockToken,
      });
    });
  });
});
