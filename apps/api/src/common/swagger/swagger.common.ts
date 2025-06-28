import { DocumentBuilder } from '@nestjs/swagger';

export default class Swagger {
  public readonly tag = 'api-docs';

  public config() {
    return new DocumentBuilder()
      .setTitle('API - Auth Learning')
      .setDescription(
        'This is the API documentation for the Auth Learning project. It provides endpoints for user authentication and management.',
      )
      .setVersion('1.0')
      .build();
  }
}
