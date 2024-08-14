'use client';

import { useMemo } from 'react';
import { AssetListConfig } from 'src/types/asset.type';
import useQueryParams from './useQueryParams';
import { isUndefined, omitBy } from 'lodash';
import { ELimit, EOrderType } from 'src/constants/enum';

export type AssetQueryParams = {
  [key in keyof AssetListConfig]: string;
};

function useAssetQueryParams(initQueryParams: AssetQueryParams = {}) {
  const queryParams: AssetQueryParams = useQueryParams();

  const queryConfig = useMemo<AssetQueryParams>(() => {
    return omitBy(
      {
        page: queryParams.page ?? initQueryParams.page ?? '1',
        take: queryParams.take ?? initQueryParams.take ?? ELimit.TWENTY,
        name: queryParams.name ?? initQueryParams.name,
        order: queryParams.order ?? initQueryParams.order ?? EOrderType.ASC,
        price: queryParams.price ?? initQueryParams.price,
        rating: queryParams.rating ?? initQueryParams.rating,
        categoryIds: queryParams.categoryIds ?? initQueryParams.categoryIds,
        search: queryParams.search ?? initQueryParams.search,
        image: queryParams.image ?? initQueryParams.image,
        mode: queryParams.mode ?? initQueryParams.mode,
      },
      isUndefined
    );
  }, [
    queryParams.take,
    queryParams.page,
    queryParams.name,
    queryParams.order,
    queryParams.price,
    queryParams.rating,
    queryParams.categoryIds,
    queryParams.search,
    queryParams.image,
    queryParams.mode,
    initQueryParams.categoryIds,
    initQueryParams.name,
    initQueryParams.order,
    initQueryParams.page,
    initQueryParams.price,
    initQueryParams.rating,
    initQueryParams.search,
    initQueryParams.take,
    initQueryParams.image,
    initQueryParams.mode,
  ]);

  return queryConfig;
}

export default useAssetQueryParams;
