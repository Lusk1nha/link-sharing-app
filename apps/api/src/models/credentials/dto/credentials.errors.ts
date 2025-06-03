import { HttpStatus } from "@nestjs/common";
import { BaseHttpException } from "src/common/exceptions/exceptions.common";

export class NotFoundCredentialException extends BaseHttpException {
  constructor() {
    super(
      {
        message: "Credentials not found.",
        code: "NOT_FOUND_CREDENTIALS",
      },
      HttpStatus.NOT_FOUND,
      "NOT_FOUND_CREDENTIALS",
    );
  }
}
