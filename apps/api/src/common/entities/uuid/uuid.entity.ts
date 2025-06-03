import { BadRequestException } from "@nestjs/common";
import { v4 as uuidv4, validate } from "uuid";

interface IUUID {
  value: string;
  equals(other: UUID): boolean;
}

export class UUID implements IUUID {
  private readonly _value: string;

  constructor(uid?: string) {
    this._value = uid ? this.validateAndUse(uid) : this.generateNew();
  }

  get value(): string {
    return this._value;
  }

  public equals(other: UUID): boolean {
    return this._value === other.value;
  }

  public static generate(): UUID {
    return new UUID();
  }

  public static isValid(value: string): boolean {
    return validate(value);
  }

  private validateAndUse(uid: string): string {
    if (!UUID.isValid(uid)) {
      throw new BadRequestException("Invalid UUID format");
    }

    return uid;
  }

  private generateNew(): string {
    return uuidv4();
  }
}
