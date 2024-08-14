'use client';
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OrderType } from 'src/types/order.type';
import { updateOrderStatus } from '@/app/apis/order.api';
import { useAppDispatch } from '@/app/store/hooks';
import { setPaymentData } from '@/app/store/paymentSlice';
import { CartItemType } from 'src/types/cart.type';

interface Props {
  orderData: OrderType;
  updateStatus: string;
}

export default function UpdateStatus({ orderData, updateStatus }: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    if (isLoading) return;
    const toastId = toast.loading('Loading...');
    setIsLoading(true);

    const response = await updateOrderStatus(orderData?.id, {
      status: updateStatus,
    });

    if (response && 'error' in response) {
      toast.error('Cancel failed!', {
        id: toastId,
      });
    } else {
      toast.success('Canceled successfully!!', {
        id: toastId,
      });
    }
    router.refresh();
    setIsLoading(false);
    onClose();
    return;
  };

  const handleCheckout = () => {
    const paymentData: CartItemType[] = orderData.orderItems.map((item) => {
      return {
        product: item.product,
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    dispatch(setPaymentData(paymentData));
    router.push('/marketplace/payment');
  };

  return (
    <div className="items-center justify-center">
      <Button
        onPress={onOpen}
        color="danger"
        // variant="light"
        radius="sm"
        className="px-4"
      >
        Cancel order
      </Button>

      <Button
        onPress={handleCheckout}
        color="primary"
        // variant="light"
        radius="sm"
        className="ml-4 px-4"
      >
        Checkout
      </Button>

      <Modal
        size="sm"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: 'bg-[#2e3965]/50 backdrop-opacity-40 w-full h-full',
          base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
          closeButton: 'hover:bg-white/5 active:bg-white/10',
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                Cancel order
              </ModalHeader>
              <ModalBody className="gap-[2rem]">
                Confirm cancellation of this order
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Close
                </Button>
                <Button
                  color="danger"
                  onClick={handleClick}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
