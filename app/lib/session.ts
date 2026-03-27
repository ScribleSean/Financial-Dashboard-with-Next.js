import 'server-only';
import { cookies } from 'next/headers';

const COOKIE = 'session';
const MAX_AGE_S = 7 * 24 * 60 * 60;

export async function createSession(userId: string) {
  cookies().set(COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_S,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete(COOKIE);
}

export async function getSession() {
  const userId = cookies().get(COOKIE)?.value;
  if (!userId) return null;
  return { userId };
}
