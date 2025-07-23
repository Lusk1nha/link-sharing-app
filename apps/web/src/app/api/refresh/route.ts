import { NextResponse } from 'next/server';

export async function POST() {
  const endpoint = process.env.API_URL + '/api/v1/auth/revalidate';

  console.log('Refreshing authentication...');

  const backendResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const setCookie = backendResponse.headers.get('set-cookie');

  const resBody = await backendResponse.json();

  console.log('Backend response:', resBody);

  return new NextResponse(JSON.stringify(resBody), {
    status: backendResponse.status,
    headers: {
      'Content-Type': 'application/json',
      ...(setCookie ? { 'set-cookie': setCookie } : {}),
    },
  });
}
