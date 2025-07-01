import { Role } from 'src/common/roles/roles.common';

export type JWTDefaultValues = {
  iss: string;
  aud: string;
  iat: number;
  sub: string;
  exp?: number;
};

export interface UserJwtPayload extends JWTDefaultValues {
  email: string;
}

export interface JwtStoredPayload extends UserJwtPayload {
  roles?: Role[]; // <- agora é opcional
}

export interface RequestUserContext extends JwtStoredPayload {
  roles: Role[]; // <- obrigatório na request
  rolesSet: Set<Role>;
}
