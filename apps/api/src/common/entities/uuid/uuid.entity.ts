import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { InvalidUuidException } from './uuid.errors';
import { ApiProperty } from '@nestjs/swagger';

export class UUID {
  @ApiProperty({
    description: 'The UUID value',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  private readonly _value: string;

  constructor(value?: string) {
    this._value =
      value !== undefined ? UUID.ensureValid(value) : UUID.generateRaw();
  }

  /**
   * Returns the UUID value as a string.
   * @returns The UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Validates if a given string is a valid UUID format.
   */
  public static isValid(value: string): boolean {
    return typeof value === 'string' && isValidUUID(value.trim());
  }

  /**
   * Create a new UUID instance with a randomly generated value.
   */
  public static generate(): UUID {
    return new UUID();
  }

  private static ensureValid(value: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new InvalidUuidException();
    }

    if (!UUID.isValid(value)) {
      throw new InvalidUuidException();
    }

    return value.trim();
  }

  private static generateRaw(): string {
    return uuidv4();
  }
}
