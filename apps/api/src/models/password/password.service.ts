import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Password } from 'src/common/entities/password/password.entity';
import {
  PasswordComparisonException,
  PasswordHashingException,
} from './password.errors';

@Injectable()
export class PasswordService {
  private readonly saltOrRounds: number = 10;

  constructor(private readonly configService: ConfigService) {
    this.saltOrRounds = +this.configService.get<number>(
      'SECURITY_SALT_ROUNDS',
      10,
    );
  }

  /**
   * Hashes a plain password using bcrypt.
   * @param password Entity representing the plain password
   * @returns {Promise<string>} The hashed password
   * @throws {PasswordHashingException} If an error occurs during hashing
   */
  async hashPassword(password: Password): Promise<string> {
    try {
      const hash = await bcrypt.hash(password.value, this.saltOrRounds);
      return hash;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      throw new PasswordHashingException(message);
    }
  }

  /**
   * Compares a plain password with a hashed password.
   * @param password Entity representing the plain password
   * @param hash The hashed password to compare against
   * @returns {Promise<boolean>} True if the passwords match, false otherwise
   * @throws {PasswordComparisonException} If an error occurs during comparison
   */
  async comparePassword(password: Password, hash: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password.value, hash);
      return isMatch;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      throw new PasswordComparisonException(message);
    }
  }
}
