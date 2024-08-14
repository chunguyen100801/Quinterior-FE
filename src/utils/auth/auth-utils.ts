import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
export const checkTokenIsExpire = (token: string) => {
  if (!token) return undefined;
  const { exp } = jwt.decode(token) as JwtPayload;
  if (!exp) return false;

  return Date.now() - exp * 1000 > 0;
};
