'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ModalConfirm, { ModalConfirmProps } from 'src/components/ModalConfirm';
import { PurchaseStatus } from 'src/constants/enum';
import useOrderStatus from 'src/hooks/useOrderStatus';
import { OrderType } from 'src/types/order.type';

interface Props {
  data: OrderType;
}

function Actions({ data }: Props) {
  const router = useRouter();
  const { isLoading, updateOrderStatus } = useOrderStatus();

  const [modalProps, setModalProps] = useState<ModalConfirmProps>({
    isOpen: false,
    message: '',
    title: '',
  });

  const handleUpdateStatus = (status: PurchaseStatus) =>
    updateOrderStatus(data.id, status, router.refresh);

  return (
    <>
      <div className="mt-6 flex justify-end gap-3 px-[24px]">
        {data.status === PurchaseStatus.PROCESSING && (
          <Button
            color="danger"
            size="lg"
            className="rounded-[4px] font-medium"
            onClick={() =>
              setModalProps({
                isOpen: true,
                title: 'Cancel Order',
                message: 'Are you sure you want to cancel this order?',
                onSubmit: () => handleUpdateStatus(PurchaseStatus.CANCELED),
                onClose: () =>
                  setModalProps({ isOpen: false, message: '', title: '' }),
              })
            }
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        {data.status === PurchaseStatus.PAID && (
          <Button
            color="primary"
            size="lg"
            className="rounded-[4px] font-medium"
            onClick={() =>
              setModalProps({
                isOpen: true,
                title: 'Confirm Order',
                message: 'Are you sure you want to confirm this order?',
                onSubmit: () => handleUpdateStatus(PurchaseStatus.CONFIRMED),
                onClose: () =>
                  setModalProps({ isOpen: false, message: '', title: '' }),
              })
            }
            disabled={isLoading}
          >
            Confirm
          </Button>
        )}
      </div>

      <ModalConfirm {...modalProps} />
    </>
  );
}

export default Actions;
