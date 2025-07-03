import { Test, TestingModule } from '@nestjs/testing';
import { MemoryUsageService } from '../memory-usage.service';
import { MemoryUsageCannotBeRetrievedException } from '../memory-usage.errors';

describe(MemoryUsageService.name, () => {
  let memoryUsageService: MemoryUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoryUsageService],
    }).compile();

    memoryUsageService = module.get<MemoryUsageService>(MemoryUsageService);
  });

  it('should be defined', () => {
    expect(memoryUsageService).toBeDefined();
  });

  describe('getMemoryUsage', () => {
    it(`should be defined function ${MemoryUsageService.prototype.getMemoryUsage.name}`, () => {
      expect(memoryUsageService.getMemoryUsage).toBeDefined();
    });

    it('should return memory usage data', () => {
      const memoryUsage = memoryUsageService.getMemoryUsage();
      expect(memoryUsage).toBeDefined();
      expect(memoryUsage.rss).toBeDefined();
      expect(memoryUsage.heapTotal).toBeDefined();
      expect(memoryUsage.heapUsed).toBeDefined();
      expect(memoryUsage.external).toBeDefined();
    });

    it('should return error if memory usage cannot be retrieved', () => {
      jest.spyOn(process, 'memoryUsage').mockImplementationOnce(() => {
        throw new MemoryUsageCannotBeRetrievedException();
      });

      expect(() => memoryUsageService.getMemoryUsage()).toThrow(
        MemoryUsageCannotBeRetrievedException,
      );
    });
  });
});
