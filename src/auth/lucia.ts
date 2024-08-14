import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import { Lucia, Session, User } from 'lucia';
import { db } from './db';
import { DatabaseUserAttributes } from './lucia-types';

export const sqliteAdapter = new BetterSqlite3Adapter(db, {
  user: 'user',
  session: 'session',
});

export const lucia = new Lucia(sqliteAdapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes: Omit<DatabaseUserAttributes, 'id'>) => {
    const { accessToken, refreshToken } = attributes;
    return {
      // attributes has the type of DatabaseUserAttributes

      accessToken,
      refreshToken,
    };
  },
});

import { cookies } from 'next/headers';
import { cache } from 'react';

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      /* empty */
    }
    return result;
  }
);
