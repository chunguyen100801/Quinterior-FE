'use client';
import React from 'react';
import './styles.css';
import { AssetItemType } from 'src/types/asset.type';
import DOMPurify from 'dompurify';

export default function ProductDescription({
  assetDetailData,
}: {
  assetDetailData: AssetItemType;
}) {
  return (
    <div className="product-description justify-between rounded-lg  py-3 sm:my-4">
      <div className="mb-4 ml-4 mt-2 text-lg font-bold">
        Product Description
      </div>
      <div
        className="ml-4 mr-4"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(assetDetailData?.description),
        }}
      />
    </div>
  );
}
