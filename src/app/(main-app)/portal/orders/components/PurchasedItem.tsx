'use client';
import { formatPriceSV } from '@/utils/utils-client';
import Image from 'next/image';
import React from 'react';
import { OrderItemsType } from 'src/types/order.type';

interface Props {
  data: OrderItemsType;
}

function PurchasedItem({ data }: Props) {
  if (!data) return null;

  const categoriesList = data.product?.categories
    ?.map((item) => item.name)
    .join(', ');
  return (
    <div className="flex items-center gap-3">
      <div className="relative block h-20 w-20">
        <Image src={data.product?.thumbnail} alt={data.product?.name} fill />
      </div>
      <div>
        <p className="text-left text-sm font-medium text-white">
          {data.product.name}
        </p>
        <p className="my-1 text-left text-xs text-white">
          Category: {categoriesList}
        </p>
        <p className="text-left text-xs text-white">x{data.quantity}</p>
      </div>
      <p className="ml-auto text-sm text-[#e55354]">
        {formatPriceSV(data.price)}
      </p>
    </div>
  );
}

export default PurchasedItem;
