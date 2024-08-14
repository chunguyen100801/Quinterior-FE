import { Button, Skeleton } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';

function Loading() {
  return (
    <div className="container_custom py-[40px]">
      <div className="flex items-start gap-4">
        <main className="w-[70%] bg-secondary2 p-6">
          <>
            <div className="mb-[26px] flex items-center justify-between">
              <Skeleton className="h-[20px] w-[300px]" />
              <h2 className="text-base font-medium text-white">Total</h2>
            </div>
            <div className="flex flex-col gap-3">
              {Array.from({
                length: 5,
              }).map((_, index) => {
                return <Skeleton key={index} className="h-[90px] rounded-sm" />;
              })}
            </div>
            <div className="mt-[20px] flex items-center justify-between"></div>
          </>
        </main>
        <aside className="w-[30%] bg-secondary2 p-6">
          <h2 className="text-base font-medium text-white">
            Subtotal (0 items)
          </h2>
          <p className="mt-[10px] text-[27px] font-semibold text-white">$0</p>
          <Button
            color="primary"
            radius="none"
            className="my-[24px] w-full rounded-[4px] font-medium"
          >
            Proceed to Checkout
          </Button>
          <p className="text-sm text-white">Secure checkout:</p>
          <Image src="/payment.png" alt="Payment" width={302} height={24} />
        </aside>
      </div>
    </div>
  );
}

export default Loading;
