import { Module } from '@nestjs/common';
import { UserController } from '../presentation/user.controller';
import { UserInfrastructureModule } from '../infrastructure';

@Module({
  imports: [UserInfrastructureModule],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
