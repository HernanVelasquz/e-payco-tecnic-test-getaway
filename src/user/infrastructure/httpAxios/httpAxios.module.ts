import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpServiceRepository } from '../../application/ports/http-service.repository';
import { HttpAxiosAdapterRepository } from './httpAxiosAdapter.repository';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: HttpServiceRepository,
      useClass: HttpAxiosAdapterRepository,
    },
  ],
  exports: [HttpServiceRepository],
})
export class HttpAxiosModule {}
