import { HttpStatus } from "@nestjs/common";
import { BaseHttpException } from "src/common/exceptions/exceptions.common";

export class InvalidEmailException extends BaseHttpException {
  constructor(value: string) {
    const message = `The provided value "${value}" is not a valid email address.`;

    super(
      {
        message,
        code: "INVALID_EMAIL",
      },
      HttpStatus.BAD_REQUEST,
      "INVALID_EMAIL",
    );
  }
}
