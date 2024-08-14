'use client';

import { getAssetListSideMarket } from '@/app/apis/asset.api';
import { Spinner } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
import useDebounce from 'src/hooks/useDebounce';
import { ModelData } from 'src/types/asset.type';
import { Blueprint } from '../../blueprint3D/blueprint';
import ProductBroad from './ProductBroad';
import SearchSide from './SearchSide';
export default function MarketSidePanel({
  bluePrint,
}: {
  bluePrint: Blueprint;
}) {
  const [search, setSearch] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);

  const loadModel = (modelData: ModelData, name: string) => {
    bluePrint.externalEvenDispatch.dispatchEvent({
      type: 'add-3d-model',
      modelData,
      name,
    });
  };

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['assetList', debouncedSearchValue],
      queryFn: ({ pageParam = 1 }) =>
        getAssetListSideMarket({
          search: debouncedSearchValue,
          page: pageParam.toString(),
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage) return 1;
        return lastPage.data.meta.hasNextPage
          ? lastPage.data.meta.page + 1
          : null;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const assetList = data?.pages.flatMap((page) => page?.data.data) || [];

  if (isError) {
    toast.error("Something went wrong, can't load products!");
  }

  return (
    <div className="relative isolate flex h-fit min-h-full w-full flex-col rounded-lg p-2">
      <SearchSide search={search} setSearch={setSearch}></SearchSide>

      {isLoading ? (
        <div className="z-0 flex flex-1 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <ProductBroad
            assetList={assetList}
            loadModel={loadModel}
          ></ProductBroad>
          <div ref={ref}></div>
        </>
      )}
    </div>
  );
}
