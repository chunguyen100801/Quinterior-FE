'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
  Badge,
} from '@nextui-org/react';
import { ShoppingCart } from 'lucide-react';
import CartItem from './CartItem';
import Link from 'next/link';
import { getCart } from '@/app/apis/cart.api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { closeCart, openCart, setCart } from '@/app/store/cartSlice';
import { formatPriceSV } from '@/utils/utils-client';

const CartDropdown = () => {
  const {
    isOpen,
    // viewItemId,
    data: cartItems,
  } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const cartListRef = useRef<HTMLDivElement>(null);
  const itemHeight = 114;

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + item.product.price;
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    const fetchCart = async () => {
      const data = await getCart();

      if (data && data.length > 0) {
        dispatch(setCart(data));
      }
    };

    fetchCart();
  }, [dispatch]);

  // useEffect(() => {
  //   if (isOpen && cartItems.length > 0) {
  //     let top = 0;
  //     if (viewItemId) {
  //       top =
  //         cartItems.findIndex((item) => item.id === viewItemId) * itemHeight -
  //         itemHeight / 2;
  //     }
  //     cartListRef.current?.scrollTo({ top, behavior: 'smooth' });
  //   }
  // }, [isOpen, viewItemId, cartItems, cartListRef.current]);

  // useEffect(() => {
  //   return () => {
  //     if (isOpen) dispatch(viewCartItem(null));
  //   };
  // }, [isOpen]);

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        shouldCloseOnInteractOutside={() => {
          dispatch(closeCart());
          return true;
        }}
        showArrow
        radius="sm"
        classNames={{
          base: 'before:bg-default-200', // change arrow background
          content: 'p-0 border-small border-divider bg-background',
        }}
        placement="bottom"
      >
        <DropdownTrigger
          onClick={() => {
            dispatch(openCart());
          }}
        >
          <Button
            isIconOnly
            color="default"
            variant="light"
            size="lg"
            radius="full"
            className="overflow-visible"
          >
            {cartItems.length > 0 ? (
              <Badge
                content={cartItems.length}
                size="md"
                color="primary"
                className="font-medium"
              >
                <ShoppingCart size={24} />
              </Badge>
            ) : (
              <ShoppingCart size={24} />
            )}
          </Button>
        </DropdownTrigger>
        {cartItems.length > 0 ? (
          <DropdownMenu
            aria-label="Cart Menu"
            disabledKeys={['header']}
            className="w-[480px] p-0"
            itemClasses={{
              base: [
                'rounded-none',
                'data-[hover=true]:bg-inherit',
                'dark:data-[hover=true]:bg-inherit',
                'data-[selectable=true]:focus:bg-inherit',
              ],
            }}
            closeOnSelect={false}
          >
            <DropdownItem
              isReadOnly
              key="header"
              className="h-[60px] px-[20px] opacity-100"
            >
              <p className="text-2xl font-bold">Cart</p>
            </DropdownItem>
            <DropdownItem
              key="cart-list"
              className="cursor-default px-[20px] opacity-100"
            >
              <div
                ref={cartListRef}
                className="flex h-[300px] flex-col overflow-auto"
              >
                {cartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    data={item}
                    size="sm"
                    height={itemHeight}
                  />
                ))}
              </div>
            </DropdownItem>
            <DropdownItem
              isReadOnly
              key="footer"
              className="p-6 pt-4 opacity-100"
            >
              <div className="flex items-center justify-between text-base font-semibold text-white">
                <p>Subtotal ({cartItems.length} items)</p>
                <p>{formatPriceSV(totalPrice)}</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link href="/marketplace/cart" className="flex-1">
                  <Button
                    color="primary"
                    radius="none"
                    className="w-full font-semibold"
                  >
                    View Cart
                  </Button>
                </Link>
              </div>
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu
            aria-label="No Cart Menu"
            disabledKeys={['header', 'no-cart']}
            className="w-[480px] p-0"
          >
            <DropdownItem
              isReadOnly
              key="header"
              className="h-[60px] px-[20px] opacity-100"
            >
              <p className="text-2xl font-bold">Cart</p>
            </DropdownItem>
            <DropdownItem isReadOnly key="no-cart" className="opacity-100">
              <div className="flex h-[410px] flex-col items-center justify-center gap-4 px-[60px] py-[30px]">
                <ShoppingCart size={44} />

                <p className="text-base font-bold">
                  Your shopping cart is empty
                </p>
              </div>
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
    </>
  );
};

export default CartDropdown;
