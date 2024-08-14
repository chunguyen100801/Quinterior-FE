import { Avatar, Button, Divider } from '@nextui-org/react';
import { Coins, Store, X } from 'lucide-react';
import React from 'react';
import { OrderType } from 'src/types/order.type';
import { getMessageStatus } from '../my-purchase/util';
import Link from 'next/link';
import { formatPriceSV } from '@/utils/utils';
import { PurchaseStatus } from 'src/constants/enum';
import ReviewModal from './ReviewModal';
import { UserInFo } from '@/lucia-auth/auth-actions';

interface Props {
  orderData: OrderType | null;
  user: UserInFo | undefined;
}

export default function OrderRow({ orderData, user }: Props) {
  const messageStatus = getMessageStatus(orderData?.status || '');

  return (
    <>
      <div className="flex flex-col space-y-4 ">
        <div className="mt-2 flex justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Store size={28} strokeWidth={0.5} />
              {orderData?.seller?.name}
            </div>
            <div className="">
              <Button
                className="h-8 text-xs"
                variant="faded"
                as={Link}
                href={`/marketplace/store/${orderData?.seller.id}`}
                radius="sm"
                target="_blank"
              >
                {/* <Store size={16} strokeWidth={0.5} /> */}
                View store
              </Button>
            </div>
          </div>
          <div className="flex space-x-2 text-sm">
            <div>{'code: ' + orderData?.orderCode}</div>
            <span>{' | '}</span>
            <div className={`${messageStatus?.color}`}>
              {messageStatus?.message}
            </div>
          </div>
        </div>
        <Divider className="my-8" />
        <div className="w-full">
          {orderData &&
            orderData?.orderItems &&
            orderData?.orderItems?.length > 0 &&
            orderData?.orderItems.map((data, index) => (
              <div key={index} className="w-full">
                <div className="flex w-full justify-between tracking-wide">
                  <div className=" flex space-x-3">
                    <Link
                      href={`/marketplace/assets/${data?.productId}`}
                      target="_blank"
                    >
                      <Avatar
                        radius="sm"
                        className="h-24 w-24 text-large"
                        src={data?.product?.thumbnail || ''}
                      />
                    </Link>
                    <div className="flex flex-col gap-2 text-lg">
                      <Link
                        href={`/marketplace/assets/${data?.productId}`}
                        target="_blank"
                      >
                        <div className="flex max-w-md font-bold text-gray-50">
                          {data?.product?.name}
                        </div>
                      </Link>
                      <div className=" flex text-sm text-slate-200">
                        <Coins size={16} strokeWidth={1} className="mr-2" />
                        {formatPriceSV(Number(data?.product?.price) || 0)}
                      </div>
                      <div className="flex items-center text-sm  text-slate-200">
                        <X size={16} strokeWidth={1} className="mr-2" />
                        {data?.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center">
                      {formatPriceSV(
                        data?.product?.price * data?.quantity || 0
                      )}

                      {/* <Button
                        color="primary"
                        variant="light"
                        radius="sm"
                        type="button"
                        className=" text-sky-400"
                      >
                        Add to Workspace
                      </Button> */}
                    </div>
                  </div>
                </div>
                <Divider className="my-4" />
              </div>
            ))}
          <div className="flex w-full justify-end space-x-4 text-base text-slate-300">
            <div className="space-y-2 text-right">
              <div>Total cost of goods:</div>
              <div>Delivery charges:</div>
              <div>Total payment:</div>
            </div>
            <div className="space-y-2 text-left">
              <div>{formatPriceSV(Number(orderData?.totalPrice) || 0)}</div>
              <div>{formatPriceSV(0)}</div>
              <div className=" text-blue-500">
                {formatPriceSV(Number(orderData?.totalPrice) || 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <div>
            {/* {orderData?.status == PurchaseStatus.PROCESSING && (
              <div className="my-6">
                <UpdateStatus
                  orderData={orderData as OrderType}
                  updateStatus={PurchaseStatus.CANCELED}
                />
              </div>
            )} */}
            {orderData?.status == PurchaseStatus.RECEIVED && (
              <div className="my-6">
                <ReviewModal orderData={orderData as OrderType} user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
