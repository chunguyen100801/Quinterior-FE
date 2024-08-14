import { lucia } from './lucia';

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUserAttributes, 'id'>;
  }
}

export interface DatabaseUserAttributes {
  id: number;
  accessToken: string;
  refreshToken: string;
}
