'use server';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUser } from '@/app/lib/data';
import { createSession, deleteSession } from '@/app/lib/session';

// eslint-disable-next-line
const demoUsers = require('../placeholder-data.js').users as Array<{
  id: string;
  name: string;
  email: string;
  password: string;
}>;

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
) {
  const parsed = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return 'Please enter a valid email and password (min 6 characters).';
  }
  const { email, password } = parsed.data;

  if (process.env.POSTGRES_URL) {
    const user = await getUser(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      await createSession(user.id);
      redirect('/dashboard');
    }
  } else {
    const u = demoUsers.find((x) => x.email === email);
    if (u && u.password === password) {
      await createSession(u.id);
      redirect('/dashboard');
    }
  }

  return 'Invalid credentials. Try user@nextmail.com / 123456 (demo).';
}

export async function signOut() {
  await deleteSession();
  redirect('/login');
}
