'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import { serverFetchWithAutoRotation } from '@/utils/fetch/fetch-service';
import { redirect } from 'next/navigation';
import { AssetItemType } from 'src/types/asset.type';
import { CartItemType } from 'src/types/cart.type';
import { ResponseApi } from 'src/types/utils.type';

type CartResponse = ResponseApi<{
  id: number;
  totalProduct: number;
  createdAt: string;
  updatedAt: string;
  cartProducts: CartItemType[];
}>;

export const getCart = async () => {
  try {
    const res: CartResponse = await serverFetchWithAutoRotation({
      method: 'GET',
      api: `/api/v1/carts/me`,
    });

    const result = res ? [...res.data.cartProducts].reverse() : null;

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getSimilarCartItems = async ({
  page = 1,
  take = 4,
}: {
  page?: number;
  take?: number;
}) => {
  try {
    const res: ResponseApi<AssetItemType[]> = await serverFetchWithAutoRotation(
      {
        method: 'GET',
        api: `/api/v1/carts/products/similar?page=${page}&take=${take}`,
      }
    );

    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const addToCart = async (
  productId: number | string,
  quantity: number = 1
) => {
  const { session } = await validateRequest();

  if (!session) {
    redirect('/auth');
  }

  const res: CartResponse = await serverFetchWithAutoRotation({
    method: 'POST',
    api: `/api/v1/carts/products`,
    body: {
      productId,
      quantity,
    },
  });

  return res;
};

export const updateCart = async (
  productId: number | string,
  quantity: number
) => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      redirect('/auth');
    }
    const res: CartResponse = await serverFetchWithAutoRotation({
      method: 'PATCH',
      api: `/api/v1/carts/products/change-quantity`,
      body: {
        productId,
        quantity,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const removeFromCart = async (productId: number | string) => {
  try {
    const res: CartResponse = await serverFetchWithAutoRotation({
      method: 'DELETE',
      api: `/api/v1/carts/products/${productId}`,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const removeMultipleItemFromCart = async (productIds: number[]) => {
  try {
    const res: CartResponse = await serverFetchWithAutoRotation({
      method: 'DELETE',
      api: `/api/v1/carts/products`,
      body: {
        productIds,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
