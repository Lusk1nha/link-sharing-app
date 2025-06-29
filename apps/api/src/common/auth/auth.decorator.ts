import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../roles/roles.common';
import { AuthGuard } from './auth.guard';
import { ImpossibleToGetUserFromRequestException } from './auth-common.errors';
import { AuthenticatedUserPayload } from './__types__/auth.types';

export const AllowAuthenticated = (...roles: Role[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard));

export function extractAuthenticatedUser(
  _data: string | undefined,
  ctx: ExecutionContext,
): AuthenticatedUserPayload {
  const request = ctx.switchToHttp().getRequest();

  const user = request.user;

  if (!user) {
    throw new ImpossibleToGetUserFromRequestException();
  }

  return user;
}

export const GetAuthUser = createParamDecorator(extractAuthenticatedUser);
