import { UUID } from './uuid.entity';

export class UUIDFactory {
  static create(): UUID {
    return UUID.generate();
  }

  static from(value: string): UUID {
    return new UUID(value);
  }
}
