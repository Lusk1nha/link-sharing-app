import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { UUID } from './uuid.entity';
import { EmptyUuidParameterException } from './uuid.errors';

export function extractUuidParameter(
  data: string,
  ctx: ExecutionContext,
): UUID {
  const request = ctx.switchToHttp().getRequest<Request>();
  const param = request.params[data];

  if (!param) {
    throw new EmptyUuidParameterException();
  }

  return new UUID(param);
}

export const UUIDParam = createParamDecorator(extractUuidParameter);
