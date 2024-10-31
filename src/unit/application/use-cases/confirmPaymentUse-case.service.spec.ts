import { TestingModule, Test } from "@nestjs/testing";
import { ResponseBuildingModel, CODE_ERROR } from "../../../common";
import { envs } from "../../../config";
import { ConfirmPaymentCommand } from "../../../user/application/command/confirmPayment.commands";
import { AttemptControlRepository} from '../../../user/application/ports/attempt-control.repository'
import {HttpServiceRepository} from '../../../user/application/ports/http-service.repository';
import {ConfirmPaymentUseCase} from '../../../user/application/use-cases/confirmPaymentUse-case.service'

describe('ConfirmPaymentUseCase', () => {
  let confirmPaymentUseCase: ConfirmPaymentUseCase;
  let httpServiceRepository: HttpServiceRepository;
  let attemptControlRepository: AttemptControlRepository;

  const mockHttpServiceRepository = {
    getInformation: jest.fn(),
    post: jest.fn(),
  };

  const mockAttemptControlRepository = {
    getCache: jest.fn(),
    deleteCache: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmPaymentUseCase,
        {
          provide: HttpServiceRepository,
          useValue: mockHttpServiceRepository,
        },
        {
          provide: AttemptControlRepository,
          useValue: mockAttemptControlRepository,
        },
      ],
    }).compile();

    confirmPaymentUseCase = module.get<ConfirmPaymentUseCase>(ConfirmPaymentUseCase);
    httpServiceRepository = module.get<HttpServiceRepository>(HttpServiceRepository);
    attemptControlRepository = module.get<AttemptControlRepository>(AttemptControlRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('confirmPayment', () => {
    it('should return an error if the token is expired', async () => {
      mockAttemptControlRepository.getCache.mockResolvedValueOnce(null);

      const result = await confirmPaymentUseCase.confirmPayment(new ConfirmPaymentCommand('987654321', 'token123', 100));

      expect(result).toEqual(new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_TOKEN_EXPIRED));
    });

    it('should return an error if the tokens do not match', async () => {
      mockAttemptControlRepository.getCache.mockResolvedValueOnce(JSON.stringify({ token: 'wrongToken', phoneNumber: '987654321', payment: 100 }));

      const result = await confirmPaymentUseCase.confirmPayment(new ConfirmPaymentCommand('987654321', 'token123', 3));

      expect(result).toEqual(new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_TOKEN_NOT_MATCH));
    });

    it('should return an error if the wallet balance is insufficient', async () => {
      mockAttemptControlRepository.getCache.mockResolvedValueOnce(JSON.stringify({ token: 'token123', phoneNumber: '987654321', payment: 100 }));
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { balance: 0 } },
      });

      const result = await confirmPaymentUseCase.confirmPayment(new ConfirmPaymentCommand('987654321', 'token123', 2));

      expect(result).toEqual(new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_BALANCE_INSUFFICIENT));
    });

    it('should confirm payment and update the balance', async () => {
      const initialBalance = 200;
      const paymentAmount = 100;
      const remainingBalance = initialBalance - paymentAmount;

      mockAttemptControlRepository.getCache.mockResolvedValueOnce(JSON.stringify({ token: 'token123', phoneNumber: '987654321', payment: paymentAmount }));
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { balance: initialBalance } },
      });
      mockHttpServiceRepository.post.mockResolvedValueOnce({ data: { result: true } });

      const result = await confirmPaymentUseCase.confirmPayment(new ConfirmPaymentCommand('987654321', 'token123', 3));

      expect(result).toEqual(new ResponseBuildingModel(true, { message: 'Pago confirmado' }));
      expect(mockHttpServiceRepository.post).toHaveBeenCalledWith(
        `${envs.serviceSoap}/wallet/987654321/updateBalance`,
        { newValance: remainingBalance }
      );
    });

    it('should handle unexpected errors', async () => {
      mockAttemptControlRepository.getCache.mockResolvedValueOnce(JSON.stringify({ token: 'token123', phoneNumber: '987654321', payment: 100 }));
      mockHttpServiceRepository.getInformation.mockRejectedValueOnce(new Error('Unexpected error'));

      const result = await confirmPaymentUseCase.confirmPayment(new ConfirmPaymentCommand('987654321', 'token 123', 0));

      expect(result).toEqual(new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_TOKEN_NOT_MATCH));
    });
  });
});