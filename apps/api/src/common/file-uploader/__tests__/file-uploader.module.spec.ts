import { FileUploaderModule } from '../file-uploader.module';

describe(FileUploaderModule.name, () => {
  let module: FileUploaderModule;

  beforeEach(() => {
    module = FileUploaderModule;
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe(FileUploaderModule.registerS3.name, () => {
    it('should instance s3 bucket', () => {
      const s3Module = FileUploaderModule.registerS3('test-bucket');
      expect(s3Module).toBeDefined();
    });
  });
});
