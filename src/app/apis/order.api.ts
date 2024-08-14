'use server';

import { validateRequest } from '@/lucia-auth/lucia';
import { serverFetchWithAutoRotation } from '@/utils/fetch/fetch-service';
import { objectToQueryString } from '@/utils/utils';
import { redirect } from 'next/navigation';
import { ResponseApi } from 'src/types/utils.type';
import {
  CreateOrderResponse,
  OrderListResponse,
  OrderType,
  PurchaseListConfig,
} from 'src/types/order.type';
import { OrderFormSchema } from '@/utils/rules/order.rule';
import { AnnualRevenue, DailyRevenue } from 'src/types/revenue.type';

export const getOrdersHistory = async (queryParams: PurchaseListConfig) => {
  try {
    const queryString = await objectToQueryString(
      queryParams as unknown as Record<string, string | number>
    );
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<OrderListResponse> | null =
      await serverFetchWithAutoRotation({
        api: `/api/v1/orders?${queryString}`,
        method: 'GET',
      });
    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const getSalesHistory = async (queryParams: PurchaseListConfig) => {
  try {
    const queryString = await objectToQueryString(
      queryParams as Record<string, string | number>
    );
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<OrderListResponse> =
      await serverFetchWithAutoRotation({
        api: `/api/v1/orders/sales-history?${queryString}`,
        method: 'GET',
      });
    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderDetail = async (id: string | number) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<OrderType> = await serverFetchWithAutoRotation({
      api: `/api/v1/orders/${id}`,
      method: 'GET',
    });
    return res ? res.data : null;
  } catch (error) {
    console.log(error);
  }
};

export const updateOrderStatus = async (
  orderId: number,
  body: { status: string }
) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<OrderListResponse> | null =
      await serverFetchWithAutoRotation({
        api: `/api/v1/orders/${orderId}/status`,
        method: 'PATCH',
        body,
      });
    return res;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return {
        error: error.message,
      };
    }
  }
};

export const createOrder = async (body: OrderFormSchema) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<CreateOrderResponse> =
      await serverFetchWithAutoRotation({
        api: `/api/v1/orders`,
        method: 'POST',
        body,
      });
    return res;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const getRevenueByYear = async (year: number | string) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<AnnualRevenue[]> = await serverFetchWithAutoRotation(
      {
        api: `/api/v1/orders/revenue-year?year=${year}`,
        method: 'GET',
      }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getRevenueByDate = async (date: string) => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      redirect('/auth');
    }
    const res: ResponseApi<DailyRevenue> = await serverFetchWithAutoRotation({
      api: `/api/v1/orders/revenue-date?date=${date}`,
      method: 'GET',
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
