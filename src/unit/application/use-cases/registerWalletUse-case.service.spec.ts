import { TestingModule, Test } from '@nestjs/testing';
import { ResponseBuildingModel } from '../../../common/response/responseBuilding';
import { CODE_ERROR } from '../../../common/error/codeError.type';
import { envs } from '../../../config/environment.config';
import { RegisterWalletUseCase } from '../../../user/application/use-cases/registerWalletUse-case.service';
import { RegisterWalletCommands } from '../../../user/application/command/registerWallet.commands';
import { HttpServiceRepository } from '../../../user/application/ports/http-service.repository';
import { IWallet } from '../../../user/domain/interfaces/wallet.interface';
import { WalletFactory } from '../../../user/domain/factories/wallet.factory';

describe('RegisterWalletUseCase', () => {
  let registerWalletUseCase: RegisterWalletUseCase;
  let httpServiceRepository: HttpServiceRepository;
  let walletFactory: WalletFactory;

  const mockHttpServiceRepository = {
    post: jest.fn(),
  };

  const mockWalletFactory = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterWalletUseCase,
        { provide: HttpServiceRepository, useValue: mockHttpServiceRepository },
        { provide: WalletFactory, useValue: mockWalletFactory },
      ],
    }).compile();

    registerWalletUseCase = module.get<RegisterWalletUseCase>(
      RegisterWalletUseCase,
    );
    httpServiceRepository = module.get<HttpServiceRepository>(
      HttpServiceRepository,
    );
    walletFactory = module.get<WalletFactory>(WalletFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should register a wallet successfully', async () => {
    const registerWallet: RegisterWalletCommands = {
      phoneNumber: '1234567890',
      userId: 'user123',
    };

    const walletMock: IWallet = {
      id: '',
      phoneNumber: '',
      userId: '',
      balance: 0,
      createAt: undefined,
    };
    const responseMock = {
      data: {
        succeeded: true,
        result: walletMock,
      },
    };

    mockWalletFactory.create.mockReturnValue(walletMock);
    mockHttpServiceRepository.post.mockResolvedValue(responseMock);

    const result = await registerWalletUseCase.registerWallet(registerWallet);

    expect(mockWalletFactory.create).toHaveBeenCalledWith(
      registerWallet.phoneNumber,
      registerWallet.userId,
    );
    expect(mockHttpServiceRepository.post).toHaveBeenCalledWith(
      `${envs.serviceSoap}/wallet/registerWallet`,
      walletMock,
    );
    expect(result).toEqual(
      new ResponseBuildingModel<IWallet>(true, walletMock),
    );
  });

  it('should return an error when registration fails', async () => {
    const registerWallet: RegisterWalletCommands = {
      phoneNumber: '1234567890',
      userId: 'user123',
    };

    const walletMock: IWallet = {
        id: '',
        phoneNumber: '',
        userId: '',
        balance: 0,
        createAt: undefined
    };
    const responseMock = {
      data: {
        succeeded: false,
        result: null,
      },
    };

    mockWalletFactory.create.mockReturnValue(walletMock);
    mockHttpServiceRepository.post.mockResolvedValue(responseMock);

    const result = await registerWalletUseCase.registerWallet(registerWallet);

    expect(mockWalletFactory.create).toHaveBeenCalledWith(
      registerWallet.phoneNumber,
      registerWallet.userId,
    );
    expect(mockHttpServiceRepository.post).toHaveBeenCalledWith(
      `${envs.serviceSoap}/wallet/registerWallet`,
      walletMock,
    );
    expect(result).toEqual(
      new ResponseBuildingModel<IWallet>(
        false,
        null,
        CODE_ERROR.ERROR_REGISTER_USER,
      ),
    );
  });
});
