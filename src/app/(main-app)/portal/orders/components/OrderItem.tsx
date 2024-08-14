'use client';
import { formatPriceSV } from '@/utils/utils-client';
import { Button } from '@nextui-org/react';
import { OrderType } from 'src/types/order.type';
import PurchasedItem from './PurchasedItem';
import { PurchaseStatus } from 'src/constants/enum';
import useOrderQueryParams from 'src/hooks/useOrderQueryParams';
import useSearchQueryParams from 'src/hooks/useSearchQueryParams';
import useOrderStatus from 'src/hooks/useOrderStatus';
import { useRouter } from 'next/navigation';
import ModalConfirm, { ModalConfirmProps } from 'src/components/ModalConfirm';
import { useState } from 'react';

interface Props {
  data: OrderType;
}

function OrderItem({ data }: Props) {
  const router = useRouter();
  const queryParams = useOrderQueryParams({
    page: '',
    take: '',
    search: '',
  });
  const { handleSearchParams } = useSearchQueryParams();
  const { updateOrderStatus } = useOrderStatus();
  const [modalProps, setModalProps] = useState<ModalConfirmProps>({
    isOpen: false,
    message: '',
    title: '',
  });

  const handleUpdateStatus = (status: PurchaseStatus) => {
    return updateOrderStatus(data.id, status, () => {
      handleSearchParams(queryParams, {
        key: 'status',
        value: status,
      });
    });
  };

  if (!data) return null;
  return (
    <>
      <div
        onClick={() => router.push(`/portal/orders/${data.id}`)}
        className="cursor-pointer bg-[#151517] p-4 active:bg-[#15151799]"
      >
        <div className="flex items-center justify-between border-b border-divider pb-2">
          <p className="text-sm font-medium text-white">
            #{data.orderCode}{' '}
            <span className="ml-2 font-normal">
              {data.customer?.firstName + ' ' + data.customer?.lastName}
            </span>
          </p>
          <p className="text-base font-normal uppercase text-[#e55354]">
            {data.status}
          </p>
        </div>
        <div className="flex flex-col gap-3 border-b border-divider py-3">
          {data.orderItems?.map((item) => (
            <PurchasedItem key={item.id} data={item} />
          ))}
        </div>

        <p className="py-4 text-right text-[18px] font-medium text-[#e55354]">
          <span className="text-white">Total:</span>{' '}
          {formatPriceSV(data.totalPrice)}
        </p>

        <div className="mt-1 flex justify-end gap-3">
          {data.status === PurchaseStatus.PROCESSING && (
            <Button
              color="danger"
              className="rounded-[4px] font-medium"
              onClick={(e) => {
                e.stopPropagation();
                setModalProps({
                  isOpen: true,
                  title: 'Cancel Order',
                  message: 'Are you sure you want to cancel this order?',
                  onSubmit: () => handleUpdateStatus(PurchaseStatus.CANCELED),
                  onClose: () =>
                    setModalProps({ isOpen: false, message: '', title: '' }),
                });
              }}
            >
              Cancel
            </Button>
          )}
          {data.status === PurchaseStatus.PAID && (
            <Button
              color="primary"
              className="rounded-[4px] font-medium"
              onClick={(e) => {
                e.stopPropagation();
                setModalProps({
                  isOpen: true,
                  title: 'Confirm Order',
                  message: 'Are you sure you want to confirm this order?',
                  onSubmit: () => handleUpdateStatus(PurchaseStatus.CONFIRMED),
                  onClose: () =>
                    setModalProps({ isOpen: false, message: '', title: '' }),
                });
              }}
            >
              Confirm
            </Button>
          )}
        </div>
      </div>

      <ModalConfirm {...modalProps} />
    </>
  );
}

export default OrderItem;
