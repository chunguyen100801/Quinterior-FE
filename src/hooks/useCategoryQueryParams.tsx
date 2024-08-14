'use client';

import { useMemo } from 'react';
import useQueryParams from './useQueryParams';
import { isUndefined, omitBy } from 'lodash';
import { ELimit } from 'src/constants/enum';
import { CategoryListConfig } from 'src/types/category.type';

export type CategoryQueryParams = {
  [key in keyof CategoryListConfig]: string;
};

function useCategoryQueryParams(initQueryParams: CategoryQueryParams = {}) {
  const queryParams: CategoryQueryParams = useQueryParams();

  const queryConfig = useMemo<CategoryQueryParams>(() => {
    return omitBy(
      {
        page: queryParams.page ?? initQueryParams.page ?? '1',
        take: queryParams.take ?? initQueryParams.take ?? ELimit.FIVE,
        search: queryParams.search ?? initQueryParams.search,
      },
      isUndefined
    );
  }, [
    queryParams.take,
    queryParams.page,
    queryParams.search,
    initQueryParams.page,
    initQueryParams.search,
    initQueryParams.take,
  ]);

  return queryConfig;
}

export default useCategoryQueryParams;
