import { Role } from 'src/common/roles/roles.common';

export type JWTDefaultValues = {
  iss: string;
  aud: string;
  iat: number;
  sub: string;
};

export interface UserJwtPayload extends JWTDefaultValues {
  email: string;
}

export interface AuthenticatedUserPayload extends UserJwtPayload {
  roles: Role[];
}
