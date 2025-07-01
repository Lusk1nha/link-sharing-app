import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { extractTokenFromHeader } from './auth.common';
import {
  NoTokenProvidedException,
  UnauthorizedTokenException,
  ForbiddenResourceException,
} from './auth-common.errors';

import { JwtStoredPayload, RequestUserContext } from './__types__/auth.types';
import { Role } from '../roles/roles.common';
import { SessionsService } from 'src/models/sessions/sessions.service';
import { RolesService } from 'src/models/roles/roles.service';
import { UUIDFactory } from '../entities/uuid/uuid.factory';

export interface AuthenticatedRequest extends Request {
  user: RequestUserContext;
}

const ROLES_META_KEY = 'roles';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly rolesService: RolesService,
    private readonly sessionsService: SessionsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    await this.authenticate(req);

    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLES_META_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) return true;

    const hasRole = requiredRoles.some((r) => req.user.rolesSet.has(r));
    if (!hasRole) throw new ForbiddenResourceException();

    return true;
  }

  private async authenticate(
    req: AuthenticatedRequest,
  ): Promise<JwtStoredPayload> {
    const token = extractTokenFromHeader(req);
    if (!token) throw new NoTokenProvidedException();

    try {
      const payload = await this.sessionsService.validateAccessToken(token);

      const rolesArr = await this.rolesService.getRolesByUserId(
        UUIDFactory.from(payload.sub),
      );

      if (rolesArr.length === 0) throw new ForbiddenResourceException();

      req.user = {
        ...payload,
        roles: rolesArr,
        rolesSet: new Set<Role>(rolesArr),
      };

      return payload;
    } catch {
      throw new UnauthorizedTokenException();
    }
  }
}
