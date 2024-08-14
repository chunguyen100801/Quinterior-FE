'use client';
import { getAssetList, getAssetListByImage } from '@/app/apis/asset.api';
import { useAppSelector } from '@/app/store/hooks';
import { dataURLtoFile } from '@/utils/utils-client';
import { Frown } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import useAssetQueryParams from 'src/hooks/useAssetQueryParams';
import { AssetItemType, MetaType } from 'src/types/asset.type';
import Pagination from '../../../../components/Pagination';
import AssetItem from './AssetItem';
import AssetsListBySearchSkeleton from './AssetsListBySearchSkeleton';
import SortAssetsList from './SortAssetsList';

function AssetsListBySearch() {
  const searchParams = useAssetQueryParams();
  const { imageSearch } = useAppSelector((state) => state.search);

  const [data, setData] = useState<AssetItemType[]>([]);
  const [meta, setMeta] = useState<MetaType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAssetsListWithImageSearch = async () => {
    if (!imageSearch) return;
    try {
      setIsLoading(true);

      const imageFile = dataURLtoFile(imageSearch, 'search.png');
      const body = new FormData();
      body.append('image', imageFile);
      const result = await getAssetListByImage(body, searchParams);
      if (result) {
        setData(result.data);
        setMeta(result.meta);
      }
    } catch (error) {
      console.log('fetchAssetsListWithImageSearch error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssetsList = async () => {
    try {
      setIsLoading(true);
      const result = await getAssetList(searchParams);
      if (result) {
        setData(result.data);
        setMeta(result.meta);
      }
    } catch (error) {
      console.log('fetchAssetsList error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageSearch) {
      fetchAssetsListWithImageSearch();
    } else {
      fetchAssetsList();
    }
  }, [searchParams.mode, imageSearch]);

  return (
    <>
      <Suspense>
        <SortAssetsList meta={meta} />
      </Suspense>
      {!isLoading ? (
        <>
          <div className="mt-[24px] grid grid-cols-12 gap-x-4 gap-y-7">
            {data &&
              data.length > 0 &&
              data.map((item) => (
                <div key={item.id} className="col-span-3">
                  <AssetItem data={item} />
                </div>
              ))}
          </div>
          {data && data.length === 0 && searchParams.search && (
            <div className="flex h-[50vh] flex-col items-center justify-center text-xl">
              <div className="mb-4 ">
                <Frown size={96} strokeWidth={0.75} />
              </div>
              <p>No result for &#8243;{searchParams.search}&#8243;</p>
            </div>
            //
          )}
          {data && data.length === 0 && !searchParams.search && (
            <div className="flex h-[50vh] flex-col items-center justify-center text-xl">
              <div className="mb-4 ">
                <Frown size={96} strokeWidth={0.75} />
              </div>
              <p>{'No product found!'}</p>
            </div>
          )}
          <div className="mt-[40px] flex justify-center">
            {meta && meta.pageCount > 1 && meta.itemCount > 0 && (
              <Pagination
                totalPages={meta.pageCount}
                searchParams={searchParams}
              />
            )}
          </div>
        </>
      ) : (
        <AssetsListBySearchSkeleton />
      )}
    </>
  );
}

export default AssetsListBySearch;
