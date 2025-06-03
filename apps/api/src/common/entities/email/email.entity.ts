import { BadRequestException } from "@nestjs/common";

export class EmailAddress {
  private readonly value: string;

  constructor(value: string) {
    this.value = EmailAddress.validateOrThrow(value);
  }

  /**
   * Returns the email address value as a string.
   * @returns The email address value.
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Compares this email address with another EmailAddress instance.
   */
  public equals(other: EmailAddress): boolean {
    return this.value === other.value;
  }

  public static isValid(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private static validateOrThrow(value: string): string {
    if (!EmailAddress.isValid(value)) {
      throw new BadRequestException(`Invalid email address format: "${value}"`);
    }

    return value;
  }
}
