'use client';

import { setProductBuyNow } from '@/app/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { UserInFo } from '@/lucia-auth/auth-actions';
import { Button, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import useCart from 'src/hooks/useCart';
import { checkCanAddToCart } from './utils';

interface Props {
  size: 'sm' | 'md';
  assetId: number;
  quantity: number;
  checkLogin: () => boolean;
  quantityInventory: number;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  userInfo: UserInFo | undefined | null;
}

function BuyButton({
  assetId,
  quantity,
  checkLogin,
  quantityInventory,
  isLoading,
  setIsLoading,
  userInfo,
}: Props) {
  const { handleAddToCart: _handleAddToCart, isAdding } = useCart();
  const { data } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleBuyNow = async () => {
    setIsLoading(true);
    const isBuying = true;
    const check = checkCanAddToCart(
      checkLogin,
      assetId,
      data,
      quantityInventory,
      quantity,
      isBuying
    );
    if (check) {
      await _handleAddToCart({ id: assetId, quantity: quantity });
    }
    if (!userInfo) {
      return false;
    }
    dispatch(setProductBuyNow(assetId));
    router.push('/marketplace/cart');
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
        variant="ghost"
        onClick={handleBuyNow}
        isDisabled={quantityInventory < 1 || isLoading}
      >
        Buy now
      </Button>
    </>
  );
}

export default BuyButton;
