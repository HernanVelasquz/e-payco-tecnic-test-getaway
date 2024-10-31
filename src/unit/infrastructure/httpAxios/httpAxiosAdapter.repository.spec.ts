import { HttpService } from "@nestjs/axios";
import { HttpAxiosAdapterRepository } from "../../../user/infrastructure/httpAxios/httpAxiosAdapter.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";

describe('HttpAxiosAdapterRepository', () => {
    let httpAxiosAdapter: HttpAxiosAdapterRepository;
    let httpService: HttpService;
  
    const mockHttpService = {
      get: jest.fn(),
      post: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          HttpAxiosAdapterRepository,
          { provide: HttpService, useValue: mockHttpService },
        ],
      }).compile();
  
      httpAxiosAdapter = module.get<HttpAxiosAdapterRepository>(HttpAxiosAdapterRepository);
      httpService = module.get<HttpService>(HttpService);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getInformation', () => {
      it('should return data from the GET request', async () => {
        const url = 'http://example.com';
        const mockResponse = { data: { key: 'value' } };
  
        mockHttpService.get.mockReturnValue(of(mockResponse));
  
        const result = await httpAxiosAdapter.getInformation(url);
  
        expect(mockHttpService.get).toHaveBeenCalledWith(url);
        expect(result).toEqual(mockResponse);
      });
    });
  
    describe('post', () => {
      it('should return data from the POST request', async () => {
        const url = 'http://example.com';
        const data = { key: 'value' };
        const mockResponse = { data: { success: true } };
  
        mockHttpService.post.mockReturnValue(of(mockResponse));
  
        const result = await httpAxiosAdapter.post(url, data);
  
        expect(mockHttpService.post).toHaveBeenCalledWith(url, data);
        expect(result).toEqual(mockResponse);
      });
    });
  });
  