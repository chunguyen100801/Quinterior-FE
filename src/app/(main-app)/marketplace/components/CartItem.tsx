'use client';
import { formatPrice } from '@/utils/utils-client';
import { Checkbox, Link, Spinner } from '@nextui-org/react';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import InputNumber from 'src/components/InputNumber';
import useCart from 'src/hooks/useCart';
import { CartItemType } from 'src/types/cart.type';
import { twMerge } from 'tailwind-merge';

interface Props {
  size?: 'sm' | 'md';
  showCheckbox?: boolean;
  data: CartItemType;
  height?: number;
  isSelected?: boolean;
  onCheck?: (checked: boolean) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
}

function CartItem({
  size = 'md',
  showCheckbox,
  data,
  height = 114,
  isSelected,
  onCheck,
  onUpdateQuantity,
}: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(data.quantity);
  const { handleRemoveFromCart, handleUpdateCart, isUpdating, isRemoving } =
    useCart();

  const itemData = data.product;
  const availableQuantity = itemData.quantity - quantity;

  const handleChangeQuantity = (value: number) => {
    setQuantity(value);

    if (value <= 0) {
      handleRemoveFromCart({ id: data.productId, callback: router.refresh });
    } else {
      handleUpdateCart({
        id: data.productId,
        quantity: value,
        callback: router.refresh,
      });
      onUpdateQuantity?.(data.productId, value);
    }
  };

  return (
    <div className={`flex h-[${height}px] w-full border-b border-divider py-4`}>
      {showCheckbox && (
        <Checkbox
          radius="none"
          className="mr-2"
          isSelected={isSelected}
          onChange={(e) => {
            onCheck && onCheck(e.target.checked);
          }}
        />
      )}
      <Link
        href={`/marketplace/assets/${itemData.id}`}
        className="relative block h-[81px] w-[81px] shrink-0"
      >
        <Image src={itemData.thumbnail} alt={itemData.name} fill />
      </Link>
      <div className="ml-4 flex flex-1 flex-col items-start justify-between">
        <div
          className={twMerge(size === 'sm' ? 'max-w-[260px]' : 'max-w-[320px]')}
        >
          <Link
            href={`/marketplace/store/${itemData.id}`}
            className={twMerge(
              'block truncate uppercase text-[#ffffffb8]',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}
            color="foreground"
          >
            {itemData.seller.name}
          </Link>
          <Link
            href="/marketplace/assets/1"
            className={twMerge(
              'block truncate font-medium text-white',
              size === 'sm' ? 'text-sm' : 'text-base'
            )}
            color="foreground"
          >
            <p>{itemData.name}</p>
          </Link>
        </div>
        {isRemoving ? (
          <Spinner size="sm" className="ml-6" />
        ) : (
          <button
            onClick={() =>
              handleRemoveFromCart({
                id: data.productId,
                callback: () => router.refresh(),
              })
            }
            className={twMerge(
              'flex items-center gap-1 text-[#ffffffb8] transition-colors hover:text-[#3d77c2]',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}
          >
            <Trash size={14} />
            Remove
          </button>
        )}
      </div>
      <div className="flex flex-col items-end">
        <p
          className={twMerge(
            'text-right text-white',
            size === 'sm' ? 'text-sm' : 'text-base font-medium'
          )}
        >
          {formatPrice(
            size === 'sm'
              ? itemData.price
              : itemData.price * quantity || itemData.price
          )}
        </p>
        {size !== 'sm' && (
          <>
            <InputNumber
              className="mt-4"
              step={1}
              min={0}
              max={itemData.quantity}
              value={quantity}
              onInputChange={handleChangeQuantity}
              disabled={isUpdating || isRemoving}
            />

            {availableQuantity < 10 && availableQuantity > -1 && (
              <p className="mt-2 text-sm text-[#ffffffb8]">
                {availableQuantity}{' '}
                {availableQuantity > 1 ? 'products' : 'product'} is available
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CartItem;
