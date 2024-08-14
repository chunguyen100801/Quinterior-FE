export const dynamic = 'force-dynamic';

import { OrderListResponse, PurchaseListConfig } from 'src/types/order.type';
// import { getUserInFo } from '@/lucia-auth/auth-actions';
import { getOrdersHistory } from '@/app/apis/order.api';
import { getUserInFo } from '@/lucia-auth/auth-actions';
import { validateRequest } from '@/lucia-auth/lucia';
import { ShoppingCart } from 'lucide-react';
import { redirect } from 'next/navigation';
import Pagination from 'src/components/Pagination';
import TabsPurchase from 'src/components/TabsPurchase';
import { ELimit } from 'src/constants/enum';
import OrderRow from '../components/OrderRow';
import SearchInput from '../components/SearchInput';
interface Props {
  searchParams: PurchaseListConfig;
}

export default async function page({ searchParams }: Props) {
  const { session } = await validateRequest();
  if (!session) redirect('/auth');

  const user = await getUserInFo();

  const _searchParams: PurchaseListConfig = searchParams || {
    page: 1,
    take: ELimit.FIFTEEN,
  };

  const orderHistoryData = await getOrdersHistory({
    ..._searchParams,
    customerId: user?.id,
  });

  return (
    <>
      <div className="mt-4 w-full rounded-md bg-[#151517]">
        <div className="flex w-full">
          <TabsPurchase />
        </div>
      </div>
      {searchParams.status === '' ||
        (!searchParams.status && (
          <div className="mt-4 flex items-center justify-center rounded-md bg-[#0f0f11]">
            <SearchInput
              assetList={orderHistoryData as OrderListResponse}
              isSearchOrder={true}
            />
          </div>
        ))}

      {orderHistoryData &&
      'data' in orderHistoryData &&
      orderHistoryData.data.length > 0 ? (
        orderHistoryData.data.map((order, index) => (
          <div
            key={index}
            className="mb-12 mt-4 w-full rounded-md bg-[#151517]"
          >
            <div className="px-10 pb-4 pt-4">
              <div className="">
                <OrderRow orderData={order} user={user} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-8 flex h-[25rem] flex-col items-center justify-center bg-[#151517]">
          <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-slate-300 bg-opacity-10">
            <ShoppingCart size={96} strokeWidth={0.75} />
          </div>
          <div> {'No orders yet'}</div>
        </div>
      )}
      <div className="mt-[40px] flex justify-center">
        {orderHistoryData &&
          'meta' in orderHistoryData &&
          orderHistoryData?.meta &&
          orderHistoryData.meta.pageCount > 1 &&
          orderHistoryData.meta.itemCount > 0 && (
            <Pagination
              totalPages={orderHistoryData?.meta.pageCount}
              searchParams={_searchParams}
              enableScrollTop={true}
            />
          )}
      </div>
    </>
  );
}
