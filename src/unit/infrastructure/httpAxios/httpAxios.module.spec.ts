import { HttpModule } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { HttpServiceRepository } from '../../../user/application/ports/http-service.repository';
import { HttpAxiosModule } from '../../../user/infrastructure/httpAxios/httpAxios.module';
import { HttpAxiosAdapterRepository } from '../../../user/infrastructure/httpAxios/httpAxiosAdapter.repository';

describe('HttpAxiosModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HttpAxiosModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide HttpServiceRepository', () => {
    const httpServiceRepository = module.get<HttpServiceRepository>(
      HttpServiceRepository,
    );
    expect(httpServiceRepository).toBeDefined();
    expect(httpServiceRepository).toBeInstanceOf(HttpAxiosAdapterRepository);
  });

  it('should import HttpModule', () => {
    const httpModule = module.get(HttpModule);
    expect(httpModule).toBeDefined();
  });
});
