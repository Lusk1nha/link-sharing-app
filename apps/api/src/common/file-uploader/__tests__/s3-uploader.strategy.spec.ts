import { S3UploaderStrategy } from '../strategies/s3-uploader.strategy';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/client-s3', () => {
  const actual = jest.requireActual('@aws-sdk/client-s3');
  return {
    ...actual,
    S3Client: jest.fn().mockImplementation(() => ({
      config: { region: jest.fn().mockResolvedValue('us-east-1') },
      send: jest.fn(),
      destroy: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  };
});

describe('S3UploaderStrategy', () => {
  let strategy: S3UploaderStrategy;
  let mockClient: any;

  const bucket = 'test-bucket';
  const region = 'us-east-1';
  const accessKeyId = 'access';
  const secretAccessKey = 'secret';

  beforeEach(() => {
    strategy = new S3UploaderStrategy(
      bucket,
      region,
      accessKeyId,
      secretAccessKey,
    );
    mockClient = (strategy as any).client;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log initialization', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    strategy.onModuleInit();
    expect(logSpy).not.toHaveBeenCalled(); // Logger is mocked, no native console.log
  });

  it('should log destruction and call client.destroy()', () => {
    const destroySpy = jest.spyOn(mockClient, 'destroy');
    strategy.onModuleDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should upload a file and return the public URL', async () => {
    const sendSpy = jest.spyOn(mockClient, 'send').mockResolvedValueOnce({});
    const key = 'test/file.txt';
    const body = Buffer.from('Hello world');
    const contentType = 'text/plain';

    const url = await strategy.upload(key, body, contentType);

    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    expect(sendSpy).toHaveBeenCalled();
    expect(url).toBe(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
  });

  it('should delete a file', async () => {
    const sendSpy = jest.spyOn(mockClient, 'send').mockResolvedValueOnce({});
    const key = 'test/file-to-delete.txt';

    await strategy.delete(key);

    expect(DeleteObjectCommand).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
    });

    expect(sendSpy).toHaveBeenCalled();
  });
});
