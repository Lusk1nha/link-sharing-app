import Swagger from './swagger.common';

describe(Swagger.name, () => {
  let swagger: Swagger;

  beforeEach(() => {
    swagger = new Swagger();
  });

  it('should be defined', () => {
    expect(swagger).toBeDefined();
  });

  it('should return instance of DocumentBuilder', () => {
    const documentBuilder = swagger.config();
    expect(documentBuilder).toBeDefined();
  });

  it('should return correct swagger configuration', () => {
    const config = swagger.config();
    expect(config.info.title).toBe('API - Auth Learning');
    expect(config.info.description).toBe(
      'This is the API documentation for the Auth Learning project. It provides endpoints for user authentication and management.',
    );
    expect(config.info.version).toBe('1.0');
  });
});
