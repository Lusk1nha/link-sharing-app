import * as bcrypt from "bcryptjs";

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);

  return passwordHash;
}

export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, passwordHash);
  return isMatch;
}
