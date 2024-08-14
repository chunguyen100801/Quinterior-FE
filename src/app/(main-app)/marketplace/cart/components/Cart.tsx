'use client';
import { Button, Checkbox } from '@nextui-org/react';
import Image from 'next/image';
import CartItem from '../../components/CartItem';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useEffect, useMemo, useState } from 'react';
import { formatPrice } from '@/utils/utils-client';
import { setCart, setProductBuyNow } from '@/app/store/cartSlice';
import { toast } from 'sonner';
import { CartItemType } from 'src/types/cart.type';
import useCart from 'src/hooks/useCart';
import AssetItem from '../../components/AssetItem';
import { AssetItemType } from 'src/types/asset.type';
import ModalConfirm from 'src/components/ModalConfirm';
import { setPaymentData } from '@/app/store/paymentSlice';
import { useRouter } from 'next/navigation';

interface Props {
  data: CartItemType[];
  similarItems: AssetItemType[];
}

function Cart({ data, similarItems }: Props) {
  const router = useRouter();
  const { productBuyNow } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [isModalClearCartOpen, setIsModalClearCartOpen] = useState(false);
  const { handleRemoveMultipleItemsFromCart } = useCart();

  const totalPrices = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [selectedItems]);

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(setCart(data));
    }
  }, [data]);

  useEffect(() => {
    if (productBuyNow) {
      const item = data.find((item) => item.productId === productBuyNow);
      item && setSelectedItems([item]);
    }
  }, [data, productBuyNow]);

  const handleUnSelectedItem = (id: number) => {
    if (id === productBuyNow) {
      dispatch(setProductBuyNow(null));
    }
    setSelectedItems(selectedItems.filter((item) => item.productId !== id));
  };

  const handleClearCart = async () => {
    try {
      const ids = data.map((item) => item.productId);

      await handleRemoveMultipleItemsFromCart({
        ids,
        showToast: false,
      });
      toast.success('Clear cart successfully!');
      dispatch(setCart([]));
      router.refresh();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    const updatedItems = selectedItems.map((item) =>
      item.productId === id ? { ...item, quantity } : item
    );
    setSelectedItems(updatedItems);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to checkout');
      return;
    }

    dispatch(setPaymentData(selectedItems));
    router.push('/marketplace/payment');
  };

  return data && data.length > 0 ? (
    <>
      <div className="flex items-start gap-4">
        <main className="w-[70%] bg-secondary2 p-6">
          <>
            <div className="mb-[26px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  radius="none"
                  isSelected={selectedItems.length === data.length}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedItems([...data]);
                    else setSelectedItems([]);
                  }}
                />
                <h1 className="text-[27px] font-semibold text-white">
                  {data.length} items in your Cart
                </h1>
              </div>
              <h2 className="text-base font-medium text-white">Total</h2>
            </div>
            <div className="flex flex-col">
              {data.map((item) => {
                const isSelected = selectedItems.some(
                  (_item) => _item.productId === item.productId
                );

                return (
                  <CartItem
                    key={item.productId}
                    data={item}
                    showCheckbox
                    isSelected={isSelected}
                    onCheck={(checked) => {
                      if (checked) setSelectedItems([...selectedItems, item]);
                      else handleUnSelectedItem(item.productId);
                    }}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                );
              })}
            </div>
            <div className="mt-[20px] flex items-center justify-between">
              <button
                className="text-base text-white transition-colors hover:text-[#3d77c2]"
                onClick={() => {
                  setIsModalClearCartOpen(true);
                }}
              >
                Clear cart
              </button>
              <h3 className="text-xl font-semibold text-white">
                Subtotal ({selectedItems.length} items):{' '}
                {formatPrice(totalPrices)}
              </h3>
            </div>
          </>
        </main>
        <aside className="w-[30%] bg-secondary2 p-6">
          <h2 className="text-base font-medium text-white">
            Subtotal ({selectedItems.length} items)
          </h2>
          <p className="mt-[10px] text-[27px] font-semibold text-white">
            {formatPrice(totalPrices)}
          </p>
          <Button
            color="primary"
            radius="none"
            className="my-[24px] w-full rounded-[4px] font-medium"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
          <p className="text-sm text-white">Secure checkout:</p>
          <Image src="/payment.png" alt="Payment" width={302} height={24} />
        </aside>
      </div>
      <div className="mt-[80px]">
        <h3 className="mb-[15px] text-[24px] font-semibold text-white">
          You might also like...
        </h3>
        {similarItems && similarItems.length > 0 && (
          <div className="grid grid-cols-12 gap-4">
            {similarItems.map((item) => (
              <div key={item.id} className="col-span-3">
                <AssetItem size="md" data={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalConfirm
        isOpen={isModalClearCartOpen}
        onClose={() => setIsModalClearCartOpen(false)}
        onSubmit={handleClearCart}
        title="Clear cart"
        message="Are you sure you want to clear your cart?"
      />
    </>
  ) : (
    <div className="px-4 pb-20 text-white">Empty cart...</div>
  );
}

export default Cart;
