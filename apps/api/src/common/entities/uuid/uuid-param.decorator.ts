import { Request } from "express";
import { BadRequestException, createParamDecorator } from "@nestjs/common";

import { UUIDFactory } from "./uuid.factory";

export const UUIDParam = createParamDecorator((data: string, req) => {
  try {
    let request: Request = req.switchToHttp().getRequest();
    let param = request.params[data];

    if (!param) {
      throw new BadRequestException(`Missing parameter: ${data}`);
    }

    let uuid = UUIDFactory.from(param);

    return uuid;
  } catch (e) {
    throw new BadRequestException(e.message);
  }
});
