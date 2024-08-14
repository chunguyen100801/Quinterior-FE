import { formatPriceSV } from '@/utils/utils-client';
import { Button } from '@nextui-org/react';
import { Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CartItemType } from 'src/types/cart.type';

interface Props {
  data: CartItemType;
}

function ProductItem({ data }: Props) {
  const categories = data.product.categories
    ?.map((category) => category.name)
    .join(', ');

  return (
    <div className="border-b border-divider py-4">
      <div className="mb-4 flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <Store size={28} strokeWidth={0.5} />
          {data?.product?.seller?.name}
        </div>
        <Button
          type="button"
          className="h-8 text-xs"
          variant="faded"
          as={Link}
          href={`/marketplace/store/${data.product.sellerId}`}
          radius="sm"
          target="_blank"
        >
          View store
        </Button>
      </div>
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/marketplace/assets/${data.productId}`}
              className="relative block h-20 w-20"
            >
              <Image
                src={data.product.thumbnail}
                alt={data.product.name}
                fill
              />
            </Link>
            <div>
              <Link
                href={`/marketplace/assets/${data.productId}`}
                className="text-left text-sm font-medium text-white"
              >
                {data.product.name}
              </Link>
              <p className="my-1 text-left text-xs text-white">
                Category: {categories}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <p className="text-center text-sm font-normal text-white">
            {formatPriceSV(data.product.price)}
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-center text-sm font-normal text-white">
            x{data.quantity}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-right text-sm font-normal text-white">
            {formatPriceSV(data.product.price * data.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
