import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetIndexResponseDto } from './dto/get-index-response.dto';

describe(AppController.name, () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getIndex: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(appService).toBeDefined();
  });

  describe('getIndex route', () => {
    it(`should be defined ${AppController.prototype.getIndex.name}`, () => {
      expect(controller.getIndex).toBeDefined();
    });

    it(`should call ${AppService.prototype.getIndex.name} when route is called`, async () => {
      const mockResponse: GetIndexResponseDto = {
        name: 'NestJS Application',
        description: 'This is a sample NestJS application.',
        version: '1.0.0',
        environment: 'development',
        authors: ['teste'],
        docsUrl: 'https://docs.nestjs.com',
      };

      jest
        .spyOn(appService, 'getIndex')
        .mockImplementationOnce(async () => mockResponse);

      const result = await controller.getIndex();

      expect(result).toEqual(mockResponse);
      expect(result.name).toEqual(mockResponse.name);
      expect(result.description).toEqual(mockResponse.description);
      expect(result.version).toEqual(mockResponse.version);
      expect(result.environment).toEqual(mockResponse.environment);
      expect(result.docsUrl).toEqual(mockResponse.docsUrl);

      expect(appService.getIndex).toHaveBeenCalled();
    });
  });
});
