'use client';
import { Divider } from '@nextui-org/react';
import { Suspense, useEffect, useRef } from 'react';
import Pagination from 'src/components/Pagination';
import { AssetListConfig, AssetListResponse } from 'src/types/asset.type';
import Asset from '../../assets/components/Asset';
import SortAssetsList from '../../components/SortAssetsList';
import { Frown } from 'lucide-react';
interface Props {
  assetList: AssetListResponse | null | undefined;
  isSearchParamsEmpty: boolean;
  _searchParams: AssetListConfig;
}

export default function AssetListStore({
  assetList,
  isSearchParamsEmpty,
  _searchParams,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollRef.current && !isSearchParamsEmpty) {
      scrollRef.current?.scrollIntoView({
        behavior: 'instant',
      });
    }
  }, [isSearchParamsEmpty, assetList]);

  return (
    <>
      <div ref={scrollRef} className="h-4"></div>
      <div className="">
        <Suspense>
          <SortAssetsList meta={assetList?.meta} />
        </Suspense>
      </div>
      <Divider className="mt-2" />
      <div className="mb-16 mt-8 w-full">
        <div className="mt-[24px] grid grid-cols-12 gap-x-4 gap-y-7">
          {assetList?.data &&
            assetList?.data?.length > 0 &&
            assetList?.data.map((data, index) => (
              <div
                key={index}
                className="col-span-6 sm:col-span-4 lg:col-span-3"
              >
                <Asset size="md" data={data} />
              </div>
            ))}
        </div>
        {assetList?.data && assetList.data.length === 0 && (
          <div className="flex h-[50vh] flex-col items-center justify-center text-xl">
            <div className="mb-4 ">
              <Frown size={96} strokeWidth={0.75} />
            </div>
            {'No product found!'}
          </div>
        )}
        <div className="mt-[40px] flex justify-center">
          {assetList?.meta &&
            assetList.meta.pageCount > 1 &&
            assetList.meta.itemCount > 0 && (
              <Pagination
                totalPages={assetList?.meta.pageCount}
                searchParams={_searchParams}
              />
            )}
        </div>
      </div>
    </>
  );
}
