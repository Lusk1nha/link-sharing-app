import { HttpStatus } from "@nestjs/common";
import { BaseHttpException } from "src/common/exceptions/exceptions.common";

export class UserNotFoundException extends BaseHttpException {
  constructor() {
    super(
      {
        message: "User not found.",
        code: "USER_NOT_FOUND",
      },
      HttpStatus.NOT_FOUND,
      "USER_NOT_FOUND",
    );
  }
}
