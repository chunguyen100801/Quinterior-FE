'use server';
import { RegisterSchemaType } from '@/app/auth/components/signup-form';
import { lucia, validateRequest } from '@/lucia-auth/lucia';
import {
  normalFetch,
  serverFetchWithAutoRotation,
} from '@/utils/fetch/fetch-service';
import { generateId } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from './db';
export default async function Page() {}
type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserInFo = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string;
  gender: string;
  cartId: number;
  createdAt: string;
  updatedAt: string;
};

export async function login(data: { email: string; password: string }) {
  try {
    const res = await normalFetch({
      method: 'POST',
      api: '/api/v1/auth/login',
      body: data,
    });
    const { accessToken, refreshToken } = res.data as Tokens;
    const tempId = generateId(15);

    db.prepare(
      'INSERT INTO user (id, accessToken, refreshToken) VALUES (?, ?, ?)'
    ).run(tempId, accessToken, refreshToken);

    const session = await lucia.createSession(tempId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return res;
  } catch (error) {
    console.log(error, 'sss');

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    console.log(error);
  }
}

export async function logout() {
  console.log('logout');

  try {
    const { session } = await validateRequest();
    if (!session) {
      return {
        error: 'Unauthorized',
      };
    }
    await serverFetchWithAutoRotation({
      method: 'DELETE',
      api: '/api/v1/auth/logout',
    });
    await lucia.invalidateSession(session.id);
    db.prepare('DELETE FROM user WHERE id = ?').run(session.userId);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    console.log('asdasdasd 121212');
  } catch (error) {
    console.log(error);
    throw new Error('Failed to logout');
  }
  redirect('/home');
}

export async function logoutClientOnly() {
  'use server';
  console.log('logout client ');
  try {
    const { session } = await validateRequest();
    if (!session) {
      return {
        error: 'Unauthorized',
      };
    }
    await lucia.invalidateSession(session.id);
    db.prepare('DELETE FROM user WHERE id = ?').run(session.userId);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.log(error);
    throw new Error('Failed to logout');
  }
  redirect('/home');
}

export async function signup(
  data: Omit<RegisterSchemaType, 'confirmPassword'>
) {
  try {
    const res = await normalFetch({
      method: 'POST',
      api: '/api/v1/auth/register',
      body: data,
    });

    return res;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    console.log(error);
  }
}

export async function resendVerifyEmail(email: string) {
  try {
    const res = await normalFetch({
      method: 'POST',
      api: '/api/v1/auth/resend-confirm-email',
      body: { email },
    });
    return res;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    console.log(error);
  }
}

export const getUserInFo = async () => {
  try {
    const userRes: UserInFo = await serverFetchWithAutoRotation({
      method: 'GET',
      api: '/api/v1/auth/me',
    });
    return userRes;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
