'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import {
  normalFetch,
  serverFetchWithAutoRotation,
} from '@/utils/fetch/fetch-service';
import { objectToQueryString } from '@/utils/utils';
import { redirect } from 'next/navigation';
import { AssetListConfig, AssetListResponse } from 'src/types/asset.type';
import { PublisherInfoType } from 'src/types/publisher.type';
import { ResponseApi } from 'src/types/utils.type';

export const getStoreInfo = async (id: number) => {
  try {
    const { session } = await validateRequest();

    let res: ResponseApi<PublisherInfoType> | null = null;
    if (!session) {
      res = await normalFetch({
        method: 'GET',
        api: `/api/v1/sellers/${id}`,
      });
    } else {
      res = await serverFetchWithAutoRotation({
        method: 'GET',
        api: `/api/v1/sellers/${id}`,
      });
    }
    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const getMyStore = async () => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res = await serverFetchWithAutoRotation({
      method: 'GET',
      api: `/api/v1/sellers/me`,
    });

    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const getAssetListInStore = async (
  storeId: string,
  queryParams: AssetListConfig
) => {
  try {
    queryParams.sellerId = storeId;
    const queryString: string = await objectToQueryString(
      queryParams as Record<string, string | number>
    );

    const { session } = await validateRequest();

    let res: ResponseApi<AssetListResponse> | null = null;
    if (!session) {
      res = await normalFetch({
        method: 'GET',
        api: `/api/v1/products?${queryString}`,
      });
    } else {
      res = await serverFetchWithAutoRotation({
        method: 'GET',
        api: `/api/v1/products?${queryString}`,
      });
    }

    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const updateSellerProfile = async (body: FormData) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res = await serverFetchWithAutoRotation({
      method: 'PATCH',
      api: `/api/v1/sellers`,
      body,
    });
    console.log(res);
    return res ? res : null;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        error: error.message,
      };
    }
  }
};
