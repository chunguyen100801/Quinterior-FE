'use server';
import { logoutClientOnly } from '@/lucia-auth/auth-actions';
import { db } from '@/lucia-auth/db';
import { validateRequest } from '@/lucia-auth/lucia';
import { checkTokenIsExpire } from '../auth/auth-utils';
type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';
interface FetchPayload<T> {
  method: HttpMethod;
  api: string;
  body?: T | Record<string, unknown> | FormData;
  bearerToken?: string;
  contentType?: string;
}

export const serverFetchWithAutoRotation = async <T,>(
  payload: Omit<FetchPayload<T>, 'bearerToken'>
) => {
  const tokens = await getAccestokenWithAutoRotation();

  if (!tokens) {
    await logoutClientOnly();
    return;
  }
  return normalFetch({
    ...payload,
    bearerToken: tokens.accessToken,
  });
};

export const normalFetch = async <T,>(payload: FetchPayload<T>) => {
  const author = payload.bearerToken && {
    Authorization: `Bearer ${payload.bearerToken}`,
  };

  // console.log('===> ', { accessToken: payload.bearerToken });

  const requestInit: RequestInit = {
    method: payload.method,
    headers:
      payload.body instanceof FormData
        ? { ...author }
        : { ...author, 'Content-Type': 'application/json' },
    body:
      payload.body instanceof FormData
        ? payload.body
        : payload.body
          ? JSON.stringify(payload.body)
          : null,
  };
  const res = await fetch(
    `${process.env.BACKEND_ENDPOINT}${payload.api}`,
    requestInit
  );
  const payloadRes = await res.json();

  if (res && !res.ok) {
    throw new Error(payloadRes.message || 'Somthing went wrong');
  }
  return payloadRes;
};

//call api of 3rd party
export const callApi3rdParty = async <T,>(payload: FetchPayload<T>) => {
  const res = await fetch(`${payload.api}`, {
    method: payload.method,
    body: payload.body ? JSON.stringify(payload.body) : null,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const payloadRes = await res.json();
  if (!res.ok && res) {
    throw new Error(payloadRes.message || 'Somthing went wrong');
  }
  return payloadRes;
};
// const userRefreshMap: Map<string,Promise<Tokens | null> >=new Map()
// bug condition race with this shit
export const getAccestokenWithAutoRotation = async () => {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const { accessToken, refreshToken } = user;
  const checkAccessToken = checkTokenIsExpire(accessToken);
  const checkRefreshToken = checkTokenIsExpire(refreshToken);
  const isTokenWorkOnServer = await checkAccessTokenWorkOnserver(accessToken);
  // console.log(checkAccessToken, checkRefreshToken, isTokenWorkOnServer);
  // check accesstoken really work on server by call get me

  if (!checkAccessToken && !checkRefreshToken && isTokenWorkOnServer) {
    return { accessToken, refreshToken };
  }
  //accestoken dead
  if (checkAccessToken && !checkRefreshToken) {
    console.log(refreshToken, 'lmaobox ');
    const newTokens = await refreshAccessToken(refreshToken);
    console.log(newTokens, 'hihi');
    if (!newTokens) return null;
    updateTokens({ ...newTokens, userId: user.id });
    return newTokens;
  }
  //accestoken dead and resfresh đead too or dont work on server
  if ((checkAccessToken && checkRefreshToken) || !isTokenWorkOnServer) {
    return null;
  }
};

const checkAccessTokenWorkOnserver = async (accessToken: string) => {
  try {
    await normalFetch({
      method: 'GET',
      api: '/api/v1/auth/me',
      bearerToken: accessToken,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateTokens = ({
  accessToken,
  refreshToken,
  userId,
}: {
  accessToken: string;
  refreshToken: string;
  userId: string;
}) => {
  db.prepare('UPDATE user SET accessToken = ? WHERE id = ?').run(
    accessToken,
    userId
  );
  db.prepare('UPDATE user SET refreshToken = ? WHERE id = ?').run(
    refreshToken,
    userId
  );
  return true;
};

const refreshAccessToken: (
  refreshToken: string
) => Promise<Tokens | null> = async (refreshToken: string) => {
  try {
    const newtoken: refreshAccessTokenType = await normalFetch({
      method: 'POST',
      api: '/api/v1/auth/refresh-token',
      bearerToken: refreshToken,
    });
    console.log(newtoken, -122312);
    return newtoken.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

type refreshAccessTokenType = {
  message: string;
  data: Tokens;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};
