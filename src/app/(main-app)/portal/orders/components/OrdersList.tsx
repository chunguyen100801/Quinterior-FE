'use client';
import React, { useEffect, useState } from 'react';
import { OrderType } from 'src/types/order.type';
import OrderItem from './OrderItem';
import { ShoppingCart } from 'lucide-react';
import { UserInFo } from '@/lucia-auth/auth-actions';
import { getSalesHistory } from '@/app/apis/order.api';
import { ELimit } from 'src/constants/enum';
import { toast } from 'sonner';
import useOrderQueryParams from 'src/hooks/useOrderQueryParams';
import { Button, Spinner } from '@nextui-org/react';
import { isUndefined, omitBy } from 'lodash';

interface Props {
  user?: UserInFo;
}

interface MetaState {
  page: number;
  totalPage: number;
  isLoading?: boolean;
}

function OrdersList({ user }: Props) {
  const queryParams = useOrderQueryParams();
  const [ordersData, setOrdersData] = useState<OrderType[]>([]);
  const [meta, setMeta] = useState<MetaState>({
    page: 1,
    totalPage: 1,
    isLoading: true,
  });

  const fetchOrdersList = async () => {
    if (!user) return;
    try {
      setMeta((prev) => ({ ...prev, isLoading: true }));
      const params = omitBy(
        {
          page: '1',
          take: ELimit.TEN,
          sellerId: user.id,
          status: queryParams.status,
          search: queryParams.search,
        },
        isUndefined
      );
      const ordersRes = await getSalesHistory(params);

      if (!ordersRes) return;
      setOrdersData(ordersRes?.data);
      setMeta({
        page: ordersRes?.meta.page,
        totalPage: ordersRes?.meta.pageCount,
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setMeta((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const fetchMoreOrders = async () => {
    if (!user) return;
    try {
      setMeta((prev) => ({ ...prev, isLoading: true }));
      const ordersRes = await getSalesHistory({
        page: (meta.page + 1).toString(),
        take: ELimit.TEN,
        customerId: user.id,
        status: queryParams.status,
      });

      if (!ordersRes) return;
      setOrdersData((prev) => [...prev, ...ordersRes.data]);
      setMeta({
        page: ordersRes?.meta.page,
        totalPage: ordersRes?.meta.pageCount,
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setMeta((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchOrdersList();
  }, [queryParams.status, queryParams.search]);

  return (
    <div className="flex flex-col gap-4">
      {ordersData &&
        ordersData.length > 0 &&
        ordersData.map((order) => <OrderItem key={order.id} data={order} />)}

      {ordersData && ordersData.length > 0 && meta.page < meta.totalPage && (
        <div className="flex w-full justify-center">
          <Button
            isDisabled={meta.isLoading}
            variant="flat"
            onPress={fetchMoreOrders}
          >
            {meta.isLoading && <Spinner color="white" size="sm" />}
            Load More
          </Button>
        </div>
      )}

      {!meta.isLoading && (!ordersData || ordersData.length === 0) && (
        <div className="flex h-[25rem] flex-col items-center justify-center bg-[#151517]">
          <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-slate-300 bg-opacity-10">
            <ShoppingCart size={96} strokeWidth={0.75} />
          </div>
          <div>No orders yet</div>
        </div>
      )}
      {meta.isLoading && (!ordersData || ordersData.length === 0) && (
        <div className="flex h-[300px] items-center justify-center gap-3 bg-[#151517] ">
          Loading <Spinner size="sm" />
        </div>
      )}
    </div>
  );
}

export default OrdersList;
