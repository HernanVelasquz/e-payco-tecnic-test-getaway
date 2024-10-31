import { Test, TestingModule } from '@nestjs/testing';

import { ResponseBuildingModel } from '../../../common/response/responseBuilding';
import { CODE_ERROR } from '../../../common/error/codeError.type';
import { CheckBalanceUseCase } from '../../../user/application/use-cases/checkBalanceUse-case.service';
import { HttpServiceRepository } from '../../../user/application/ports/http-service.repository';
import { IWallet } from '../../../user/domain/interfaces/wallet.interface';

describe('CheckBalanceUseCase', () => {
  let checkBalanceUseCase: CheckBalanceUseCase;
  let httpServiceRepository: HttpServiceRepository;

  const mockHttpServiceRepository = {
    getInformation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckBalanceUseCase,
        {
          provide: HttpServiceRepository,
          useValue: mockHttpServiceRepository,
        },
      ],
    }).compile();

    checkBalanceUseCase = module.get<CheckBalanceUseCase>(CheckBalanceUseCase);
    httpServiceRepository = module.get<HttpServiceRepository>(
      HttpServiceRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkBalanceWallet', () => {
    it('should return an error if user does not exist', async () => {
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: null },
      });

      const result = await checkBalanceUseCase.checkBalanceWallet(
        '12345678',
        '987654321',
      );

      expect(result).toEqual(
        new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_USER_NOT_FOUND),
      );
    });

    it('should return an error if wallet does not exist', async () => {
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { id: 'user-123' } }, // Simulamos que el usuario existe
      });
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: null },
      });

      const result = await checkBalanceUseCase.checkBalanceWallet(
        '12345678',
        '987654321',
      );

      expect(result).toEqual(
        new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_WALLET_NOT_FOUND,
        ),
      );
    });

    it('should return an error if user ID does not match wallet user ID', async () => {
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { id: 'user-123' } }, // Simulamos que el usuario existe
      });
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { userId: 'user-456' } }, // Simulamos que la wallet pertenece a otro usuario
      });

      const result = await checkBalanceUseCase.checkBalanceWallet(
        '12345678',
        '987654321',
      );

      expect(result).toEqual(
        new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_USER_NOT_MATCH),
      );
    });

    it('should return the wallet information if everything is correct', async () => {
      const mockWallet: IWallet = {
        id: 'wallet-1',
        phoneNumber: '987654321',
        userId: 'user-123',
        balance: 100,
        createAt: new Date(),
      };
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { id: 'user-123' } }, // Simulamos que el usuario existe
      });
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: mockWallet }, // Simulamos que la wallet existe
      });

      const result = await checkBalanceUseCase.checkBalanceWallet(
        '12345678',
        '987654321',
      );

      expect(result).toEqual(new ResponseBuildingModel(true, mockWallet));
    });
  });
});
