import { Test, TestingModule } from "@nestjs/testing";
import { SecurityTokenModule } from "../../../user/infrastructure/securityToken/securityToken.module";
import { TokenServiceRepository } from "../../../user/application/ports/token-service.repository";
import { SecurityTokenAdapter } from "../../../user/infrastructure/securityToken";

describe('SecurityTokenModule', () => {
    let module: TestingModule;
  
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [SecurityTokenModule],
      }).compile();
    });
  
    it('should compile the module', () => {
      expect(module).toBeDefined();
    });
  
    it('should provide TokenServiceRepository', () => {
      const tokenServiceRepository = module.get<TokenServiceRepository>(TokenServiceRepository);
      expect(tokenServiceRepository).toBeDefined();
      expect(tokenServiceRepository).toBeInstanceOf(SecurityTokenAdapter);
    });
  });
