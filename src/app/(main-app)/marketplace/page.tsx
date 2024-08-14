import { Suspense } from 'react';
import AsideFilter from './components/AsideFilter';
import AssetsListBySearch from './components/AssetsListBySearch';
import { AssetListConfig } from 'src/types/asset.type';
import { getAssetList } from '@/app/apis/asset.api';
import { EAssetListMode, ELimit } from 'src/constants/enum';
import AssetsList from './components/AssetsList';
import AssetsListSkeleton from './components/AssetsListSkeleton';

interface Props {
  searchParams: AssetListConfig;
}

async function Page({ searchParams }: Props) {
  const _searchParams = {
    ...searchParams,
    page: searchParams.page || '1',
    take: searchParams.take || ELimit.TWENTY,
  };
  const assets = await getAssetList(_searchParams);

  return (
    <div className="container_custom">
      <div className="flex w-full gap-8 py-10">
        <main className="w-[75%]">
          {_searchParams.search ||
          _searchParams.mode === EAssetListMode.SEARCH ? (
            <AssetsListBySearch />
          ) : (
            <Suspense fallback={<AssetsListSkeleton />}>
              <AssetsList
                data={assets?.data}
                meta={assets?.meta}
                searchParams={_searchParams}
              />
            </Suspense>
          )}
        </main>
        <aside className="w-[25%] max-w-[25%]">
          <Suspense>
            <AsideFilter />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

export default Page;
