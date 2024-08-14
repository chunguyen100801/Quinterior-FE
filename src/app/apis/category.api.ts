'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import {
  normalFetch,
  serverFetchWithAutoRotation,
} from '@/utils/fetch/fetch-service';
import { objectToQueryString } from '@/utils/utils';
import {
  CategoryItem,
  CategoryListConfig,
  CategoryRequestBody,
} from 'src/types/category.type';
import { ResponseWithPaging, ResponseApi } from 'src/types/utils.type';

export const getCategoriesList = async (queryParams?: CategoryListConfig) => {
  try {
    const { session } = await validateRequest();

    const queryString = await objectToQueryString(
      queryParams as Record<string, string | number>
    );

    let res: ResponseApi<ResponseWithPaging<CategoryItem[]>> | null = null;

    if (!session) {
      res = await normalFetch({
        method: 'GET',
        api: `/api/v1/categories?${queryString}`,
      });
    } else {
      res = await serverFetchWithAutoRotation({
        method: 'GET',
        api: `/api/v1/categories?${queryString}`,
      });
    }

    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async (body: CategoryRequestBody) => {
  try {
    const { session } = await validateRequest();
    if (!session) return;

    const res: ResponseApi<null> = await serverFetchWithAutoRotation({
      method: 'POST',
      api: `/api/v1/categories`,
      body,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateCategory = async (
  id: string | number,
  body: CategoryRequestBody
) => {
  try {
    const { session } = await validateRequest();
    if (!session) return;

    const res: ResponseApi<null> = await serverFetchWithAutoRotation({
      method: 'PATCH',
      api: `/api/v1/categories/${id}`,
      body,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (id: number | string) => {
  try {
    const { session } = await validateRequest();
    if (!session) return;

    const res: ResponseApi<null> = await serverFetchWithAutoRotation({
      method: 'DELETE',
      api: `/api/v1/categories/${id}`,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
