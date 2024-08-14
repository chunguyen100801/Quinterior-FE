import React from 'react';
import CategoriesTable from './components/CategoriesTable';
import { redirect } from 'next/navigation';
import { getCategoriesList } from '@/app/apis/category.api';
import { MetaType } from 'src/types/utils.type';
import { CategoryListConfig } from 'src/types/category.type';
import isEmpty from 'lodash/isEmpty';
import { ELimit } from 'src/constants/enum';
import { validateRequest } from '@/lucia-auth/lucia';
import { getUserInFo } from '@/lucia-auth/auth-actions';

interface Props {
  searchParams: CategoryListConfig;
}

async function Page({ searchParams }: Props) {
  const { session } = await validateRequest();
  if (!session) {
    return redirect('/auth');
  }

  const user = await getUserInFo();

  const _searchParams = !isEmpty(searchParams)
    ? { ...searchParams, sellerId: user?.id }
    : {
        page: '1',
        take: ELimit.FIVE,
        sellerId: user?.id,
      };

  const res = await getCategoriesList(_searchParams);

  return (
    <div>
      <div className="flex justify-between px-[24px] py-[16px]">
        <h2 className="text-[27px] font-bold text-white">All categories</h2>
      </div>
      <div className="flex-1 px-[24px] py-[16px]">
        <CategoriesTable data={res?.data ?? []} meta={res?.meta as MetaType} />
      </div>
    </div>
  );
}

export default Page;
