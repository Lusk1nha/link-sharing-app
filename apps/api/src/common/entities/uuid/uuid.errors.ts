import { HttpStatus } from "@nestjs/common";
import { BaseHttpException } from "src/common/exceptions/exceptions.common";

export class InvalidUUIDException extends BaseHttpException {
  constructor(value: string) {
    const message = `The provided value "${value}" is not a valid UUID.`;

    super(
      {
        message,
        code: "INVALID_UUID",
      },
      HttpStatus.BAD_REQUEST,
      "INVALID_UUID",
    );
  }
}
