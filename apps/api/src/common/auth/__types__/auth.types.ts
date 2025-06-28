export type JWTDefaultValues = {
  iss: string;
  aud: string;
  iat: number;
  sub: string;
};

export interface UserJwtPayload extends JWTDefaultValues {
  email: string;
}
