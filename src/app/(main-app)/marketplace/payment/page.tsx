import { Metadata } from 'next';
import React from 'react';
import { validateRequest } from '@/lucia-auth/lucia';
import { redirect } from 'next/navigation';
import { getMyAddress } from '@/app/apis/address.api';
import PaymentForm from './components/PaymentForm';

export const metadata: Metadata = {
  title: 'Payment',
  description: 'Order payment',
};

async function Page() {
  const { user, session } = await validateRequest();

  if (!session) redirect('/auth');
  console.log('user', user);

  const addresses = await getMyAddress();

  return (
    <div className="container_custom py-[40px]">
      <PaymentForm addresses={addresses} />
    </div>
  );
}

export default Page;
