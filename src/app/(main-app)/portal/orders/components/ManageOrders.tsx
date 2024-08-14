import React from 'react';
import OrdersList from './OrdersList';
import { UserInFo } from '@/lucia-auth/auth-actions';
import SearchOrders from './SearchOrders';
import TabsPurchase from 'src/components/TabsPurchase';

interface Props {
  user?: UserInFo;
}

function ManageOrders({ user }: Props) {
  return (
    <div className="pb-8">
      <div className="mb-8">
        <SearchOrders />
      </div>
      <div className="mb-6 bg-[#151517]">
        <TabsPurchase />
      </div>
      <OrdersList user={user} />
    </div>
  );
}

export default ManageOrders;
