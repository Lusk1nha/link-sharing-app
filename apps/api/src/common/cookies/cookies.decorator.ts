import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function extractCookies(
  data: string | undefined,
  ctx: ExecutionContext,
) {
  const req = ctx.switchToHttp().getRequest();
  return data != null ? req.cookies?.[data] : req.cookies;
}

export const Cookies = createParamDecorator(extractCookies);
