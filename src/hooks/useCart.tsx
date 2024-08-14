'use client';

import {
  addToCart,
  getCart,
  removeFromCart,
  removeMultipleItemFromCart,
  updateCart,
} from '@/app/apis/cart.api';
import { setCart } from '@/app/store/cartSlice';
import { useAppDispatch } from '@/app/store/hooks';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

function useCart() {
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemoveFromCart = useCallback(
    async ({
      id,
      callback,
    }: {
      id: number;
      callback?: (id: number) => void;
    }) => {
      setIsRemoving(true);
      try {
        const res = await removeFromCart(id);
        const cart = await getCart();

        callback && callback(id);

        if (cart) {
          dispatch(setCart(cart));
          toast.success(res?.message);
        } else {
          toast.error('An error occurred');
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setIsRemoving(false);
      }
    },
    [dispatch]
  );

  const handleRemoveMultipleItemsFromCart = useCallback(
    async ({ ids, showToast }: { ids: number[]; showToast?: boolean }) => {
      setIsRemoving(true);
      try {
        const res = await removeMultipleItemFromCart(ids);
        const cart = await getCart();

        if (cart) {
          dispatch(setCart(cart));
          showToast && toast.success(res?.message);
        } else {
          showToast && toast.error('An error occurred');
        }
      } catch (error) {
        if (error instanceof Error) showToast && toast.error(error.message);
      } finally {
        setIsRemoving(false);
      }
    },
    [dispatch]
  );

  const handleAddToCart = useCallback(
    async ({
      id,
      quantity = 1,
      callback,
    }: {
      id: number;
      quantity?: number;
      callback?: (id: number) => void;
    }) => {
      setIsAdding(true);

      try {
        const res = await addToCart(id, quantity);
        const cart = await getCart();

        callback && callback(id);

        if (cart) {
          dispatch(setCart(cart));
          toast.success(res?.message);
        } else {
          toast.error('An error occurred');
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setIsAdding(false);
      }
    },
    [dispatch]
  );

  const handleUpdateCart = useCallback(
    async ({
      id,
      quantity,
      showToast = false,
      callback,
    }: {
      id: number;
      quantity: number;
      showToast?: boolean;
      callback?: (id: number) => void;
    }) => {
      setIsUpdating(true);
      try {
        const res = await updateCart(id, quantity);
        const cart = await getCart();

        callback && callback(id);

        if (cart) {
          dispatch(setCart(cart));
          showToast && toast.success(res?.message);
        } else {
          showToast && toast.error('An error occurred');
        }
      } catch (error) {
        if (error instanceof Error) showToast && toast.error(error.message);
      } finally {
        setIsUpdating(false);
      }
    },
    [dispatch]
  );

  return {
    handleRemoveFromCart,
    handleAddToCart,
    handleUpdateCart,
    handleRemoveMultipleItemsFromCart,
    isAdding,
    isRemoving,
    isUpdating,
  };
}

export default useCart;
