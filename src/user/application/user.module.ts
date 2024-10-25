import { Module } from '@nestjs/common';

import { UserFactory } from '../domain';
import { UserController } from '../presentation';
import { UserInfrastructureModule } from '../infrastructure';
import { RegisterUserUseCase } from './use-cases';

@Module({
  imports: [UserInfrastructureModule],
  controllers: [UserController],
  providers: [UserFactory, RegisterUserUseCase],
})
export class UserModule {}
