import { Module } from '@nestjs/common';
import { SecurityTokenAdapter } from './securityToken.repository';
import { TokenServiceRepository } from '../../../user/application/ports/token-service.repository';

@Module({
  providers: [
    {
      provide: TokenServiceRepository,
      useClass: SecurityTokenAdapter,
    },
  ],
  exports: [TokenServiceRepository],
})
export class SecurityTokenModule {}
