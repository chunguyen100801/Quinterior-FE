'use client';
import { Spinner } from '@nextui-org/react';
import { ShoppingBasket } from 'lucide-react';
import useCart from 'src/hooks/useCart';
import { twMerge } from 'tailwind-merge';

interface Props {
  size: 'sm' | 'md';
  assetId: number;
}

function AddToCartButton({ size, assetId }: Props) {
  const { handleAddToCart, isAdding } = useCart();

  return isAdding ? (
    <div className="flex w-[96px] items-center justify-center">
      <Spinner size="sm" />
    </div>
  ) : (
    <button
      onClick={() => handleAddToCart({ id: assetId, quantity: 1 })}
      className="flex cursor-pointer items-center gap-[2px] transition-opacity hover:opacity-80"
    >
      <ShoppingBasket size={14} color="#9e9e9e" />
      <p
        className={twMerge(
          'font-medium text-[#3d77c2]',
          size === 'md' ? 'text-sm' : 'text-xs'
        )}
      >
        + Add to Cart
      </p>
    </button>
  );
}

export default AddToCartButton;
