import { Role } from "../roles/roles.util";

export type JWTDefaultValues = {
  iss: string;
  aud: string;
  iat: number;
  sub: string;
};

export interface CreateUserAuthType extends JWTDefaultValues {
  name?: string;
}

export interface UserAuthType extends JWTDefaultValues {
  name?: string;
  roles: Role[];
}
