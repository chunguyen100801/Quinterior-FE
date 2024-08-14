import React from 'react';
import AssetItemSkeleton from './AssetItemSkeleton';
import { Skeleton } from '@nextui-org/react';

function AssetsListSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton className="w-[120px] rounded-lg">
          <div className="h-[36px] w-[120px] rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="ml-auto mr-[16px] w-[128px] rounded-lg">
          <div className="h-[36px] w-[128px] rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-[158px] rounded-lg">
          <div className="h-[36px] w-[158px] rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
      <div className="mt-[24px] grid grid-cols-12 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="col-span-3">
            <AssetItemSkeleton />
          </div>
        ))}
      </div>
      <div className="mt-[40px] flex justify-center">
        <Skeleton className="w-[320px] rounded-lg">
          <div className="h-[36px] w-[220px] rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </>
  );
}

export default AssetsListSkeleton;
