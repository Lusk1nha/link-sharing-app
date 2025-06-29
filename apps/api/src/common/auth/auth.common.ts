import { Request } from 'express';
import { AuthenticatedUserPayload } from './__types__/auth.types';
import { Role } from 'src/common/roles/roles.common';
import { ForbiddenResourceException } from './auth-common.errors';

export const checkRowLevelPermission = (
  user: AuthenticatedUserPayload | undefined,
  requestedUid?: string | string[],
  allowedRoles: Role[] = [Role.Admin],
): true => {
  /* 1️⃣ If user is not provided, deny access */
  if (!user) throw new ForbiddenResourceException();

  /* 2️⃣ Role‑based shortcut */
  if (user.roles?.some((r) => allowedRoles.includes(r))) return true;

  /* 3️⃣ Check if requestedUid is provided */
  if (!requestedUid) throw new ForbiddenResourceException();

  /* 4️⃣ Normalize requestedUid to an array */
  const ids = Array.isArray(requestedUid) ? requestedUid : [requestedUid];

  /* 5️⃣ Check if user ID is in the requested IDs */
  if (!ids.includes(user.sub)) throw new ForbiddenResourceException();

  return true;
};

export const extractTokenFromHeader = (req: Request): string | undefined => {
  const header = req.headers.authorization?.trim();

  if (!header) return;

  const [type, token] = header.split(/\s+/);
  return type.toLowerCase() === 'bearer' && token ? token : undefined;
};
