import { Module } from '@nestjs/common';
import { UserController } from '../presentation';
import { UserInfrastructureModule } from '../infrastructure';

@Module({
  imports: [UserInfrastructureModule],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
