'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import { serverFetchWithAutoRotation } from '@/utils/fetch/fetch-service';
import { ChangePasswordSchemaType } from '@/utils/rules/user.rule';
import { objectToQueryString } from '@/utils/utils';
import { redirect } from 'next/navigation';
import { ResponseApi } from 'src/types/utils.type';
import { AssetListConfig, AssetListResponse } from 'src/types/asset.type';

export const updateProfileMe = async (body: FormData) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res = await serverFetchWithAutoRotation({
      api: `/api/v1/users/me/update`,
      method: 'PATCH',
      body,
    });
    return res ? res : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return {
        error: error.message,
      };
    }
  }
};

// change password
export const changePassword = async (body: ChangePasswordSchemaType) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res = await serverFetchWithAutoRotation({
      method: 'PATCH',
      api: `/api/v1/users/me/change-password`,
      body,
    });
    return res ? res : null;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    console.log(error);
  }
};

export const getPurchasedProducts = async (queryParams: AssetListConfig) => {
  try {
    const queryString = await objectToQueryString(
      queryParams as Record<string, string | number>
    );
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res: ResponseApi<AssetListResponse> | null =
      await serverFetchWithAutoRotation({
        api: `/api/v1/products/purchased?${queryString}`,
        method: 'GET',
      });
    return res ? res.data : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return {
        error: error.message,
      };
    }
  }
};
