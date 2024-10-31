import { TestingModule, Test } from "@nestjs/testing";
import { UserInfrastructureModule } from "../../user/infrastructure/user-infrastructure.module";
import {HttpAxiosModule} from '../../user/infrastructure/httpAxios/httpAxios.module';
import {RedisPersistentStore} from '../../user/infrastructure/redis/redis-persistence.module'
import { EmailInfrastructureModule } from "../../user/infrastructure/email/emailInfrastructure.module";
import { SecurityTokenModule } from "../../user/infrastructure/securityToken";

describe('UserInfrastructureModule', () => {
    let module: TestingModule;
  
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [UserInfrastructureModule],
      }).compile();
    });
  
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });
  
    it('should import RedisPersistentStore', () => {
      const redisStore = module.get<RedisPersistentStore>(RedisPersistentStore);
      expect(redisStore).toBeDefined();
    });
  
    it('should import HttpAxiosModule', () => {
      const httpAxiosModule = module.get<HttpAxiosModule>(HttpAxiosModule);
      expect(httpAxiosModule).toBeDefined();
    });
  
    it('should import SecurityTokenModule', () => {
      const securityTokenModule = module.get<SecurityTokenModule>(SecurityTokenModule);
      expect(securityTokenModule).toBeDefined();
    });
  
    it('should import EmailInfrastructureModule', () => {
      const emailInfrastructureModule = module.get<EmailInfrastructureModule>(EmailInfrastructureModule);
      expect(emailInfrastructureModule).toBeDefined();
    });
  });
  