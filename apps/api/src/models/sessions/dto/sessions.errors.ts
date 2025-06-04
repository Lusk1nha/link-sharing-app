import { HttpStatus } from "@nestjs/common";
import { BaseHttpException } from "src/common/exceptions/exceptions.common";

export class SessionMissingSecretException extends BaseHttpException {
  constructor(secret: string) {
    super(
      { message: `Missing secret: ${secret}`, code: "MISSING_SECRET" },
      HttpStatus.INTERNAL_SERVER_ERROR,
      "MISSING_SECRET",
    );
  }
}
