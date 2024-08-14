import React from 'react';
import PublisherInfoSkeleton from '../components/PublisherInfoSkeleton';
import AssetsListSkeleton from '../../components/AssetsListBySearchSkeleton';

function Loading() {
  return (
    <div className="container_custom py-[40px]">
      <PublisherInfoSkeleton />
      <AssetsListSkeleton />
    </div>
  );
}

export default Loading;
