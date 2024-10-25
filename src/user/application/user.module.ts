import { Module } from '@nestjs/common';

import { UserFactory, WalletFactory } from '../domain';
import { UserController } from '../presentation';
import { UserInfrastructureModule } from '../infrastructure';
import { RegisterUserUseCase, RegisterWalletUseCase } from './use-cases';

@Module({
  imports: [UserInfrastructureModule],
  controllers: [UserController],
  providers: [UserFactory, RegisterUserUseCase, WalletFactory ,RegisterWalletUseCase],
})
export class UserModule {}
