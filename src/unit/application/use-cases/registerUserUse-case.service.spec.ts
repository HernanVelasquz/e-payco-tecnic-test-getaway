import { TestingModule, Test } from "@nestjs/testing";
import { ResponseBuildingModel } from "../../../common/response/responseBuilding";
import { CODE_ERROR } from "../../../common/error/codeError.type";
import { envs } from "../../../config/environment.config";
import { RegisterUserUseCase } from "../../../user/application/use-cases/registerUserUse-case.service";
import { IUser } from "../../../user/domain/interfaces/user.interface";
import { HttpServiceRepository } from "../../../user/application/ports";
import { UserFactory } from "../../../user/domain/factories/user.factory";
import {RegisterUserCommand} from '../../../user/application/command/registerUser.commands'
import { RegisterWalletUseCase } from "../../../user/application/use-cases/registerWalletUse-case.service";

describe('RegisterUser UseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let httpServiceRepository: HttpServiceRepository;
  let registerWalletUseCase: RegisterWalletUseCase;
  let userFactory: UserFactory;

  const mockHttpServiceRepository = {
    post: jest.fn(),
    getInformation: jest.fn(),
  };

  const mockRegisterWalletUseCase = {
    registerWallet: jest.fn(),
  };

  const mockUserFactory = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: HttpServiceRepository,
          useValue: mockHttpServiceRepository,
        },
        {
          provide: RegisterWalletUseCase,
          useValue: mockRegisterWalletUseCase,
        },
        {
          provide: UserFactory,
          useValue: mockUserFactory,
        },
      ],
    }).compile();

    registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    httpServiceRepository = module.get<HttpServiceRepository>(HttpServiceRepository);
    registerWalletUseCase = module.get<RegisterWalletUseCase>(RegisterWalletUseCase);
    userFactory = module.get<UserFactory>(UserFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser ', () => {
    it('should return an error if the user already exists', async () => {
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { succeeded: true },
      });

      const result = await registerUserUseCase.registerUser (new RegisterUserCommand('DNI', '12345678', 'John Doe', 'john@example.com', '987654321'));

      expect(result).toEqual(new ResponseBuildingModel<IUser >(false, null, CODE_ERROR.ERROR_USER_EXITS));
    });

    it('should register a new user and wallet successfully', async () => {
      const userMock = { id: 'user-1', phoneNumber: '987654321' };
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { succeeded: false },
      });
      mockUserFactory.create.mockReturnValue(userMock);
      mockHttpServiceRepository.post.mockResolvedValueOnce({
        data: { succeeded: true, result: userMock },
      });
      mockRegisterWalletUseCase.registerWallet.mockResolvedValueOnce(new ResponseBuildingModel(true, null));

      const result = await registerUserUseCase.registerUser (new RegisterUserCommand('DNI', '12345678', 'John Doe', 'john@example.com', '987654321'));

      expect(result).toEqual(new ResponseBuildingModel<IUser >(true, userMock as IUser));
      expect(mockRegisterWalletUseCase.registerWallet).toHaveBeenCalledWith({
        userId: userMock.id,
        phoneNumber: userMock.phoneNumber,
      });
    });

    it('should return an error if registering the user fails', async () => {
      const userMock = { id: 'user-1', phoneNumber: '987654321' };
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { succeeded: false },
      });
      mockUserFactory.create.mockReturnValue(userMock);
      mockHttpServiceRepository.post.mockResolvedValueOnce({
        data: { succeeded: false },
      });

      const result = await registerUserUseCase.registerUser (new RegisterUserCommand('DNI', '12345678', 'John Doe', 'john@example.com', '987654321'));

      expect(result).toEqual(new ResponseBuildingModel<IUser >(false, null, CODE_ERROR.ERROR_REGISTER_USER));
    });

    it('should return an error if registering the wallet fails', async () => {
      const userMock = { id: 'user-1', phoneNumber: '987654321' };
      mockHttpServiceRepository.getInformation.mockResolvedValueOnce({
        data: { succeeded: false },
      });
      mockUserFactory.create.mockReturnValue(userMock);
      mockHttpServiceRepository.post.mockResolvedValueOnce({
        data: { succeeded: true, result: userMock },
      });
      mockRegisterWalletUseCase.registerWallet.mockResolvedValueOnce(new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_REGISTER_WALLET));

      const result = await registerUserUseCase.registerUser (new RegisterUserCommand('DNI', '12345678', 'John Doe', 'john@example.com', '987654321'));

      expect(result).toEqual(new ResponseBuildingModel<IUser >(false, null, CODE_ERROR.ERROR_REGISTER_USER));
    });
  });
});