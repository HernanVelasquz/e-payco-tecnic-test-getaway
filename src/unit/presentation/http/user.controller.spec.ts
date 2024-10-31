import { TestingModule, Test } from '@nestjs/testing';
import { ResponseBuildingModel } from '../../../common/response/responseBuilding';
import { RegisterUserUseCase } from '../../../user/application/use-cases/registerUserUse-case.service';
import { IUser } from '../../../user/domain/interfaces/user.interface';
import { IWallet } from '../../../user/domain/interfaces/wallet.interface';
import { UserController } from '../../../user/presentation/http/user.controller';
import {
  RegisterUserDto,
  WalletRecharger,
  RegisterPaymentDto,
  ConfirmPaymentDto,
} from '../../../user/presentation/http/dto';
import { RechargeWalletUseCase } from '../../../user/application/use-cases/rechargeWalletUse-case.service';
import { CheckBalanceUseCase } from '../../../user/application/use-cases/checkBalanceUse-case.service';
import { PaymentUseCaseService } from '../../../user/application/use-cases/paymentUse-Case.service';
import { ConfirmPaymentUseCase } from '../../../user/application/use-cases/confirmPaymentUse-case.service';
import { RegisterPaymentCommands } from '../../../user/application/command/registerPayment.commands';
import { RegisterUserCommand } from '../../../user/application/command/registerUser.commands';
import { WalletRechargerCommands } from '../../../user/application/command/walletRecharger.commands';
import { ConfirmPaymentCommand } from '../../../user/application/command/confirmPayment.commands';

describe('UserController', () => {
  let userController: UserController;
  let registerUserUseCase: RegisterUserUseCase;
  let rechargeWalletUseCase: RechargeWalletUseCase;
  let checkBalanceUseCase: CheckBalanceUseCase;
  let paymentUseCaseService: PaymentUseCaseService;
  let confirmPaymentUseCase: ConfirmPaymentUseCase;

  const mockRegisterUserUseCase = {
    registerUser: jest.fn(),
  };

  const mockRechargeWalletUseCase = {
    rechargeWallet: jest.fn(),
  };

  const mockCheckBalanceUseCase = {
    checkBalanceWallet: jest.fn(),
  };

  const mockPaymentUseCaseService = {
    payment: jest.fn(),
  };

  const mockConfirmPaymentUseCase = {
    confirmPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: RechargeWalletUseCase, useValue: mockRechargeWalletUseCase },
        { provide: CheckBalanceUseCase, useValue: mockCheckBalanceUseCase },
        { provide: PaymentUseCaseService, useValue: mockPaymentUseCaseService },
        { provide: ConfirmPaymentUseCase, useValue: mockConfirmPaymentUseCase },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    rechargeWalletUseCase = module.get<RechargeWalletUseCase>(
      RechargeWalletUseCase,
    );
    checkBalanceUseCase = module.get<CheckBalanceUseCase>(CheckBalanceUseCase);
    paymentUseCaseService = module.get<PaymentUseCaseService>(
      PaymentUseCaseService,
    );
    confirmPaymentUseCase = module.get<ConfirmPaymentUseCase>(
      ConfirmPaymentUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should register a user', async () => {
    const dto: RegisterUserDto = {
      typeDocument: '',
      numberDocument: '',
      fullName: '',
      email: '',
      phoneNumber: '',
    };
    const response: ResponseBuildingModel<IUser> = {
      succeeded: false,
    };

    mockRegisterUserUseCase.registerUser.mockResolvedValue(response);

    expect(await userController.registerUser(dto)).toBe(response);
    expect(mockRegisterUserUseCase.registerUser).toHaveBeenCalledWith(
      expect.any(RegisterUserCommand),
    );
  });

  it('should recharge a wallet', async () => {
    const dto: WalletRecharger = {
      phoneNumber: '',
      documentNumber: '',
      mountRecharger: 0,
    };
    const response: ResponseBuildingModel<{ boolean; null }> = {
      succeeded: false,
    };

    mockRechargeWalletUseCase.rechargeWallet.mockResolvedValue(response);

    expect(await userController.walletRecharge(dto)).toBe(response);
    expect(mockRechargeWalletUseCase.rechargeWallet).toHaveBeenCalledWith(
      expect.any(WalletRechargerCommands),
    );
  });

  it('should pre-process payment', async () => {
    const dto: RegisterPaymentDto = {
      phoneNumber: '',
      discountValue: 0,
    };
    const response = {
      /* simula la respuesta esperada */
    };

    mockPaymentUseCaseService.payment.mockResolvedValue(response);

    expect(await userController.prePayment(dto)).toBe(response);
    expect(mockPaymentUseCaseService.payment).toHaveBeenCalledWith(
      expect.any(RegisterPaymentCommands),
    );
  });

  it('should confirm payment', async () => {
    const dto: ConfirmPaymentDto = {
      phoneNumber: '',
      token: '',
      payment: 0,
    };
    const response = {
      /* simula la respuesta esperada */
    };

    mockConfirmPaymentUseCase.confirmPayment.mockResolvedValue(response);

    expect(await userController.confirmPayment(dto)).toBe(response);
    expect(mockConfirmPaymentUseCase.confirmPayment).toHaveBeenCalledWith(
      expect.any(ConfirmPaymentCommand),
    );
  });

  it('should check balance', async () => {
    const numberDocument = '123456';
    const phoneNumber = '9876543210';
    const response: ResponseBuildingModel<IWallet> = {
      succeeded: false,
    };

    mockCheckBalanceUseCase.checkBalanceWallet.mockResolvedValue(response);

    expect(await userController.checkBalance(numberDocument, phoneNumber)).toBe(
      response,
    );
    expect(mockCheckBalanceUseCase.checkBalanceWallet).toHaveBeenCalledWith(
      numberDocument,
      phoneNumber,
    );
  });
});
