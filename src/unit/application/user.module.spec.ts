import { TestingModule, Test } from "@nestjs/testing";
import { UserModule } from "../../user/application/user.module";
import { PaymentUseCaseService } from '../../user/application/use-cases/paymentUse-Case.service';
import { ConfirmPaymentUseCase } from "../../user/application/use-cases/confirmPaymentUse-case.service";
import {CheckBalanceUseCase} from "../../user/application/use-cases/checkBalanceUse-case.service";
import {RegisterWalletUseCase} from '../../user/application/use-cases/registerWalletUse-case.service';
import {RechargeWalletUseCase} from '../../user/application/use-cases/rechargeWalletUse-case.service';
import {RegisterUserUseCase} from '../../user/application/use-cases/registerUserUse-case.service';
import { UserFactory } from "../../user/domain/factories/user.factory";
import {WalletFactory} from '../../user/domain/factories/wallet.factory';
import { UserController } from "../../user/presentation/http/user.controller";


describe('UserModule', () => {
    let module: TestingModule;
  
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [UserModule],
      }).compile();
    });
  
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });
  
    it('should have UserController defined', () => {
      const controller = module.get<UserController>(UserController);
      expect(controller).toBeDefined();
    });
  
    it('should have all use cases defined', () => {
      const registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
      const registerWalletUseCase = module.get<RegisterWalletUseCase>(RegisterWalletUseCase);
      const rechargeWalletUseCase = module.get<RechargeWalletUseCase>(RechargeWalletUseCase);
      const checkBalanceUseCase = module.get<CheckBalanceUseCase>(CheckBalanceUseCase);
      const confirmPaymentUseCase = module.get<ConfirmPaymentUseCase>(ConfirmPaymentUseCase);
      const paymentUseCaseService = module.get<PaymentUseCaseService>(PaymentUseCaseService);
  
      expect(registerUserUseCase).toBeDefined();
      expect(registerWalletUseCase).toBeDefined();
      expect(rechargeWalletUseCase).toBeDefined();
      expect(checkBalanceUseCase).toBeDefined();
      expect(confirmPaymentUseCase).toBeDefined();
      expect(paymentUseCaseService).toBeDefined();
    });
  
    it('should have factories defined', () => {
      const userFactory = module.get<UserFactory>(UserFactory);
      const walletFactory = module.get<WalletFactory>(WalletFactory);
  
      expect(userFactory).toBeDefined();
      expect(walletFactory).toBeDefined();
    });
  });
  