import { Test, TestingModule } from "@nestjs/testing";
import { SecurityTokenAdapter } from "../../../user/infrastructure/securityToken";

describe('SecurityTokenAdapter', () => {
    let securityTokenAdapter: SecurityTokenAdapter;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [SecurityTokenAdapter],
      }).compile();
  
      securityTokenAdapter = module.get<SecurityTokenAdapter>(SecurityTokenAdapter);
    });
  
    it('should be defined', () => {
      expect(securityTokenAdapter).toBeDefined();
    });
  
    describe('generateToken', () => {
      it('should generate a token between 100000 and 999999', async () => {
        const token = await securityTokenAdapter.generateToken();
        expect(token).toBeGreaterThanOrEqual(100000);
        expect(token).toBeLessThan(1000000);
      });
    });
  
    describe('validateToken', () => {
      it('should throw an error', () => {
        expect(() => securityTokenAdapter.validateToken('123456', '654321')).toThrowError('Method not implemented.');
      });
    });
  });
  