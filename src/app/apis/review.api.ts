'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import {
  normalFetch,
  serverFetchWithAutoRotation,
} from '@/utils/fetch/fetch-service';
import { objectToQueryString } from '@/utils/utils';
import {
  ReviewListConfig,
  ReviewPostSchemaType,
  ReviewType,
} from 'src/types/review.type';
import { ResponseApi, ResponseWithPaging } from 'src/types/utils.type';
import { redirect } from 'next/navigation';

export const getReviewByProduct = async (queryParams: ReviewListConfig) => {
  try {
    const queryString = await objectToQueryString(
      queryParams as unknown as Record<string, string | number>
    );

    const res: ResponseApi<ResponseWithPaging<ReviewType[]>> =
      await normalFetch({
        method: 'GET',
        api: `/api/v1/reviews?${queryString}`,
      });

    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const addReview = async (body: ReviewPostSchemaType) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res: ResponseApi<ReviewType> = await serverFetchWithAutoRotation({
      method: 'POST',
      api: '/api/v1/reviews',
      body,
    });

    return res ? res.data : null;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};

export const editReview = async (
  reviewId: number,
  body: ReviewPostSchemaType
) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }

    const res = await serverFetchWithAutoRotation({
      method: 'PATCH',
      api: `/api/v1/reviews/${reviewId}`,
      body,
    });

    return res ? res.data : null;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};
