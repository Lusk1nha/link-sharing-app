import { LoginUserFormSchema } from '@/shared/validations/login-user-validation';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const json = await request.json();

  const { email, password } = LoginUserFormSchema.parse(json);

  const endpoint = process.env.API_URL + '/api/v1/auth/login';

  const backendResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const setCookie = backendResponse.headers.get('set-cookie');
  const resBody = await backendResponse.json();

  return new NextResponse(JSON.stringify(resBody), {
    status: backendResponse.status,
    headers: {
      'Content-Type': 'application/json',
      ...(setCookie ? { 'set-cookie': setCookie } : {}),
    },
  });
}
