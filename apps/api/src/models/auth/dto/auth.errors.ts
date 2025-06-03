import { HttpStatus } from "@nestjs/common";

import { BaseHttpException } from "src/common/exceptions/exceptions.common";

export class AuthUserNotFoundException extends BaseHttpException {
  constructor() {
    super(
      {
        message: "User not found",
        code: "USER_NOT_FOUND",
      },
      HttpStatus.NOT_FOUND,
      "AUTH_USER_NOT_FOUND",
    );
  }
}

export class AuthInvalidCredentialsException extends BaseHttpException {
  constructor() {
    super(
      {
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      },
      HttpStatus.UNAUTHORIZED,
      "AUTH_INVALID_CREDENTIALS",
    );
  }
}

export class AuthEmailAlreadyInUseException extends BaseHttpException {
  constructor() {
    super(
      {
        message: "Email already in use",
        code: "EMAIL_ALREADY_IN_USE",
      },
      HttpStatus.BAD_REQUEST,
      "AUTH_EMAIL_ALREADY_IN_USE",
    );
  }
}
