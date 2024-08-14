'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import {
  normalFetch,
  serverFetchWithAutoRotation,
} from '@/utils/fetch/fetch-service';
import { objectToQueryString } from '@/utils/utils';
import { AssetQueryParams } from 'src/hooks/useAssetQueryParams';
import { AssetItemType, AssetListResponse } from 'src/types/asset.type';
import { ResponseApi, ResponseWithPaging } from 'src/types/utils.type';

export const getAssetListSideMarket = async (queryParams: AssetQueryParams) => {
  try {
    const queryString = objectToQueryString(
      queryParams as Record<string, string | number>
    );
    let res: ResponseWithPaging<AssetListResponse> | null = null;
    res = await normalFetch({
      method: 'GET',
      api: `/api/v1/products?${queryString}`,
    });
    return res ? res : null;
  } catch (error) {
    console.log(error);
  }
};

export const getAssetList = async (queryParams: AssetQueryParams) => {
  try {
    const queryString = await objectToQueryString(
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

export const getAssetListByImage = async (
  body: FormData,
  queryParams: AssetQueryParams
) => {
  try {
    const queryString = await objectToQueryString(
      queryParams as Record<string, string | number>
    );

    const { session } = await validateRequest();
    let res: ResponseApi<AssetListResponse> | null = null;
    if (!session) {
      res = await normalFetch({
        method: 'POST',
        api: `/api/v1/products/image-search?${queryString}`,
        body,
      });
    } else {
      res = await serverFetchWithAutoRotation({
        method: 'POST',
        api: `/api/v1/products/image-search?${queryString}`,
        body,
      });
    }
    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const getAssetDetail = async (productId: string) => {
  try {
    const { session } = await validateRequest();

    let res: ResponseApi<AssetItemType> | null = null;
    if (!session) {
      res = await normalFetch({
        method: 'GET',
        api: `/api/v1/products/${productId}`,
      });
    } else {
      res = await serverFetchWithAutoRotation({
        method: 'GET',
        api: `/api/v1/products/${productId}`,
      });
    }

    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const getAssetListSimilar = async (
  productId: string,
  page: number,
  take: string
) => {
  try {
    const { session } = await validateRequest();

    let res: ResponseApi<AssetListResponse> | null = null;
    if (!session) {
      res = await normalFetch({
        method: 'GET',
        api: `/api/v1/products/${productId}/similar?page=${page}&take=${take}`,
      });
    } else {
      res = await serverFetchWithAutoRotation({
        method: 'GET',
        api: `/api/v1/products/${productId}/similar?page=${page}&take=${take}`,
      });
    }

    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const createAsset = async (body: FormData) => {
  try {
    const { session } = await validateRequest();
    if (!session) return;

    const res: ResponseApi<null> = await serverFetchWithAutoRotation({
      method: 'POST',
      api: `/api/v1/products`,
      body,
    });

    return res;
  } catch (error) {
    console.log('createAssetError', error);
  }
};

export const updateAsset = async (id: number | string, body: FormData) => {
  try {
    const { session } = await validateRequest();
    if (!session) return;

    const res: ResponseApi<null> = await serverFetchWithAutoRotation({
      method: 'PATCH',
      api: `/api/v1/products/${id}`,
      body,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAsset = async (id: number | string) => {
  try {
    const { session } = await validateRequest();
    if (!session) return;

    const res: ResponseApi<null> = await serverFetchWithAutoRotation({
      method: 'DELETE',
      api: `/api/v1/products/${id}`,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
