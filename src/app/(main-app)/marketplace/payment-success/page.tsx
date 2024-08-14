import { Button } from '@nextui-org/react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Payment Success',
  description: 'Payment Success Page',
};

function Page() {
  return (
    <div className="container_custom">
      <div className="flex min-h-[400px] flex-col items-center justify-center py-20">
        <Image
          src="/circle-check.svg"
          width={200}
          height={200}
          alt="Warning icon"
        />

        <h2 className="mb-4 mt-6 text-2xl font-bold text-white">
          Your payment was successful
        </h2>
        <p className="text-sm text-white">
          Thank you for your payment. To see more details.
        </p>

        <Button
          as={Link}
          href="/user/my-purchase"
          color="primary"
          radius="none"
          className="mt-4 w-[200px] font-semibold"
        >
          My Purchase
        </Button>
      </div>
    </div>
  );
}

export default Page;
