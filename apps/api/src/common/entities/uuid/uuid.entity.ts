import { BadRequestException } from "@nestjs/common";
import { v4 as uuidv4, validate as isValidUUID } from "uuid";

export class UUID {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ? UUID.validateOrThrow(value) : UUID.generateUUID();
  }

  /**
   * Returns the UUID value as a string.
   * @returns The UUID value.
   */
  public toString(): string {
    return this.value;
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
      throw new BadRequestException(`Invalid UUID format: "${value}"`);
    }

    return value;
  }

  private static generateUUID(): string {
    return uuidv4();
  }
}
