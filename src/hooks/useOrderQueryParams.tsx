'use client';

import { useMemo } from 'react';
import useQueryParams from './useQueryParams';
import { isUndefined, omitBy } from 'lodash';
import { ELimit } from 'src/constants/enum';
import { PurchaseListConfig } from 'src/types/order.type';

export type OrderQueryParams = {
  [key in keyof PurchaseListConfig]: string;
};

function useOrderQueryParams(initQueryParams: OrderQueryParams = {}) {
  const queryParams: OrderQueryParams = useQueryParams();

  const queryConfig = useMemo<OrderQueryParams>(() => {
    return omitBy(
      {
        page: queryParams.page ?? initQueryParams.page ?? '1',
        take: queryParams.take ?? initQueryParams.take ?? ELimit.FIFTEEN,
        search: queryParams.search ?? initQueryParams.search,
        customerId: queryParams.customerId ?? initQueryParams.customerId,
        sellerId: queryParams.sellerId ?? initQueryParams.sellerId,
        status: queryParams.status ?? initQueryParams.status,
      },
      isUndefined
    );
  }, [
    queryParams.take,
    queryParams.page,
    queryParams.search,
    queryParams.customerId,
    queryParams.sellerId,
    queryParams.status,
    initQueryParams.page,
    initQueryParams.search,
    initQueryParams.take,
    initQueryParams.customerId,
    initQueryParams.sellerId,
    initQueryParams.status,
  ]);

  return queryConfig;
}

export default useOrderQueryParams;
