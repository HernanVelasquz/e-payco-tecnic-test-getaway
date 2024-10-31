import { TestingModule, Test } from "@nestjs/testing";
import { ResponseBuildingModel } from "../../../common/response/responseBuilding";
import {CODE_ERROR} from '../../../common/error/codeError.type'
import { envs } from "../../../config/environment.config";
import { RechargeWalletUseCase } from "../../../user/application/use-cases/rechargeWalletUse-case.service";
import {HttpServiceRepository} from '../../../user/application/ports/http-service.repository'
import {WalletRechargerCommands} from '../../../user/application/command/walletRecharger.commands';

describe('RechargeWalletUseCase', () => {
  let rechargeWalletUseCase: RechargeWalletUseCase;
  let httpServiceRepository: HttpServiceRepository;

  const mockHttpServiceRepository = {
    getInformation: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RechargeWalletUseCase,
        {
          provide: HttpServiceRepository,
          useValue: mockHttpServiceRepository,
        },
      ],
    }).compile();

    rechargeWalletUseCase = module.get<RechargeWalletUseCase>(RechargeWalletUseCase);
    httpServiceRepository = module.get<HttpServiceRepository>(HttpServiceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rechargeWallet', () => {

    it('should update the wallet balance successfully', async () => {
      const initialBalance = 200;
      const rechargeAmount = 100;
      const newBalance = initialBalance + rechargeAmount;

      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { id: 'user-123' } }, // Simulamos que el usuario existe
      });
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { result: { phoneNumber: '987654321', balance: initialBalance } }, // Simulamos que la wallet existe
      });
      mockHttpServiceRepository.post.mockResolvedValueOnce({
        data: { result: true },
      });

      const result = await rechargeWalletUseCase.rechargeWallet(new WalletRechargerCommands('12345678', '987654321', rechargeAmount));

      expect(result).toEqual(new ResponseBuildingModel(true, null));
      expect(mockHttpServiceRepository.post).toHaveBeenCalledWith(
        `${envs.serviceSoap}/wallet/987654321/updateBalance`,
        { newValance: newBalance }
      );
    });
  });
});