import { Injectable, Logger } from '@nestjs/common';
import { GetIndexResponseDto } from './dto/get-index-response.dto';
import { ConfigService } from '@nestjs/config';
import { AppErrorToSetEnvironmentVariableException } from './app.errors';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {}

  async getIndex(): Promise<GetIndexResponseDto> {
    const name = this.getEnvironmentVariable('APP_NAME');
    const description = this.getEnvironmentVariable('APP_DESCRIPTION');
    const version = this.getEnvironmentVariable('APP_VERSION', '1.0.0');
    const environment = this.getEnvironmentVariable('NODE_ENV', 'development');

    const authors = ['Lucas Pedro da Hora <lucaspedro517@gmail.com>'];

    const currentUrl = process.env.DOCS_URL || 'http://localhost:3000/docs';

    return {
      name,
      description,
      version,
      environment,
      authors,
      docsUrl: currentUrl,
    };
  }

  private getEnvironmentVariable(key: string, defaultValue?: string): string {
    const value =
      defaultValue !== undefined
        ? this.configService.get<string>(key, defaultValue)
        : this.configService.get<string>(key);

    if (!value) {
      this.logger.error(`Environment variable ${key} is not set.`);
      throw new AppErrorToSetEnvironmentVariableException(key);
    }

    return value;
  }
}
