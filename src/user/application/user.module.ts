import { Module } from '@nestjs/common';

import { UserFactory, WalletFactory } from '../domain';
import { UserInfrastructureModule } from '../infrastructure';
import { UserController } from '../presentation';
import {
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
  ],
})
export class UserModule {}
