'use client';

import { useAppSelector } from '@/app/store/hooks';
import { Button, Spinner } from '@nextui-org/react';
import useCart from 'src/hooks/useCart';
import { checkCanAddToCart } from './utils';

interface Props {
  size: 'sm' | 'md';
  assetId: number;
  quantity: number;
  checkLogin: () => boolean;
  quantityInventory: number;
  isLoading: boolean;
}

function AddToCart({
  assetId,
  quantity,
  checkLogin,
  quantityInventory,
  isLoading,
}: Props) {
  const { handleAddToCart: _handleAddToCart, isAdding } = useCart();
  const { data } = useAppSelector((state) => state.cart);

  const handleAddToCart = () => {
    const check = checkCanAddToCart(
      checkLogin,
      assetId,
      data,
      quantityInventory,
      quantity
    );
    if (check) {
      _handleAddToCart({ id: assetId, quantity: quantity });
    }
  };

  return isAdding ? (
    <Button
      color="primary"
      className="text-white"
      size="lg"
      radius="sm"
      variant="flat"
      disabled
    >
      <Spinner size="sm" />
    </Button>
  ) : (
    <>
      <Button
        color="primary"
        className="text-white"
        size="lg"
        radius="sm"
        variant="flat"
        onClick={handleAddToCart}
        isDisabled={quantityInventory < 1 || isLoading}
      >
        Add to cart
      </Button>
    </>
  );
}

export default AddToCart;
