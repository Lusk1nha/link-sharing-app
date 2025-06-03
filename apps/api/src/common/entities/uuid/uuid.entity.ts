import { v4 as uuidv4, validate as isValidUUID } from "uuid";
import { InvalidUUIDException } from "./uuid.errors";
import { ApiProperty } from "@nestjs/swagger";

export class UUID {
  @ApiProperty({
    type: String,
    description: "A universally unique identifier (UUID) string.",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ? UUID.validateOrThrow(value) : UUID.generateUUID();
  }

  /**
   * Returns the UUID value as a string.
   * @returns The UUID value.
   */
  public value(): string {
    return this._value;
  }

  /**
   * Compares this UUID with another UUID instance.
   */
  public equals(other: UUID): boolean {
    return this.value === other.value;
  }

  /**
   * Create a new UUID instance with a randomly generated value.
   */
  public static generate(): UUID {
    return new UUID();
  }

  /**
   * Validates if a given string is a valid UUID format.
   */
  public static isValid(value: string): boolean {
    return isValidUUID(value);
  }

  private static validateOrThrow(value: string): string {
    if (!UUID.isValid(value)) {
      throw new InvalidUUIDException(value);
    }

    return value;
  }

  private static generateUUID(): string {
    return uuidv4();
  }
}
