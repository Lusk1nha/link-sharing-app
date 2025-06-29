import { ApiProperty } from '@nestjs/swagger';

export class GetIndexResponseDto {
  @ApiProperty({
    description: 'The name of the application',
    example: 'Auth Learn NestJS',
  })
  name: string;

  @ApiProperty({
    description: 'A brief description of the application',
    example: 'A simple authentication service built with NestJS',
  })
  description: string;

  @ApiProperty({
    description: 'The version of the application',
    example: '1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'The authors of the application',
    example: ['Lucas Pedro da Hora <lucaspedro517@gmail.com>'],
  })
  authors: string[];

  @ApiProperty({
    description: 'The environment in which the application is running',
    example: 'development',
  })
  environment: string;

  @ApiProperty({
    description: 'The URL to the API documentation',
    example: 'http://localhost:3000/docs',
  })
  docsUrl: string;
}
