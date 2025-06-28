import { Injectable } from '@nestjs/common';

import { createHmac } from 'crypto';
import {
  GenerateHashHmacException,
  InvalidHashSecretException,
} from './hash.errors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  private readonly secret: string;
  private readonly algorithm: string;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('HMAC_SECRET');
    const algorithm = this.configService.get<string>('HMAC_ALGORITHM');

    if (!secretKey || !algorithm) {
      throw new InvalidHashSecretException();
    }

    this.secret = secretKey;
    this.algorithm = algorithm;
  }

  /**
   * Generates a HMAC hash for the given data using the configured secret and algorithm.
   * @param data The data to hash.
   * @returns {string} The generated HMAC hash in hexadecimal format.
   * @throws {GenerateHashHmacException} If an error occurs during hash generation.
   */
  generate(data: string): string {
    this.ensureSecretIsValid();

    try {
      return createHmac(this.algorithm, this.secret)
        .update(data, 'utf8')
        .digest('hex');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro desconhecido no HMAC';
      throw new GenerateHashHmacException(message);
    }
  }

  /**
   * Ensures that the secret used for HMAC generation is valid.
   * Throws an exception if the secret is not a non-empty string.
   * @throws {InvalidHashSecretException} If the secret is invalid.
   */
  private ensureSecretIsValid(): void {
    if (typeof this.secret !== 'string' || !this.secret.trim()) {
      throw new InvalidHashSecretException();
    }
  }
}
