import React from 'react';
import ManageOrders from './components/ManageOrders';
import { validateRequest } from '@/lucia-auth/lucia';
import { redirect } from 'next/navigation';
import { getUserInFo } from '@/lucia-auth/auth-actions';

async function Page() {
  const { session } = await validateRequest();

  if (!session) {
    redirect('/auth');
  }

  const user = await getUserInFo();

  return (
    <div>
      <div className="flex justify-between px-[24px] py-[16px]">
        <h2 className="text-[27px] font-bold text-white">All orders</h2>
      </div>
      <div className="flex-1 px-[24px] py-[16px]">
        <ManageOrders user={user} />
      </div>
    </div>
  );
}

export default Page;
