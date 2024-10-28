import { Module } from '@nestjs/common';

import { UserFactory, WalletFactory } from '../domain';
import { UserInfrastructureModule } from '../infrastructure';
import { UserController } from '../presentation';
import {
  CheckBalanceUseCase,
  RechargeWalletUseCase,
  RegisterUserUseCase,
  RegisterWalletUseCase,
} from './use-cases';

@Module({
  imports: [UserInfrastructureModule],
  controllers: [UserController],
  providers: [
    UserFactory,
    RegisterUserUseCase,
    WalletFactory,
    RegisterWalletUseCase,
    RechargeWalletUseCase,
    CheckBalanceUseCase,
  ],
})
export class UserModule {}
