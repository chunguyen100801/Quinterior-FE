'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { getAssetListSimilar } from '@/app/apis/asset.api';

import Asset from './Asset';
import { AssetItemType } from 'src/types/asset.type';

export default function SimilarAssetsList({
  productId,
}: {
  productId: string;
}) {
  const [assetList, setAssetList] = useState<AssetItemType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pagecount, setPagecount] = useState(0);
  const takeItem = '10';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productSimilar = await getAssetListSimilar(
          productId,
          page,
          takeItem
        );
        const data = productSimilar?.data as AssetItemType[];
        setPagecount(productSimilar?.meta.pageCount as number);
        data &&
          setAssetList((prev) => {
            const existingIds = new Set(prev.map((asset) => asset.id));
            const newData = data.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newData];
          });
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, productId]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="w-full">
      {assetList?.length > 0 && (
        <div className="mb-8 mt-2 text-2xl font-bold">
          Maybe you are interested
        </div>
      )}
      <div className="mt-[24px] grid grid-cols-12 gap-x-4 gap-y-7 lg:grid-cols-5">
        {assetList?.length > 0 &&
          assetList?.map((data, index) => (
            <div
              key={index}
              className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-1"
            >
              <Asset size="md" data={data} />
            </div>
          ))}
      </div>
      {!loading && page < pagecount && (
        <div className="mt-8 flex w-full items-center justify-center">
          <Button color="primary" variant="ghost" onClick={handleLoadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
