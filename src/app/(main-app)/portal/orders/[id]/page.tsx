import { getOrderDetail } from '@/app/apis/order.api';
import { validateRequest } from '@/lucia-auth/lucia';
import {
  BadgeCheckIcon,
  ChevronLeft,
  CircleDollarSignIcon,
  NotepadTextIcon,
  SquareSlashIcon,
  StarIcon,
  TruckIcon,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import PurchasedItem from '../components/PurchasedItem';
import { formatPriceSV } from '@/utils/utils';
import { PurchaseStatus } from 'src/constants/enum';
import Actions from './Actions';

type MetadataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const order = await getOrderDetail(id);

  return {
    title: `Order - ${order?.orderCode}` || 'Order Detail',
    description: order?.orderCode || 'Order Detail',
  };
}

interface OrderProps {
  params: { id: string };
}

async function Page({ params }: OrderProps) {
  const STATUS_ITEMS = [
    {
      status: PurchaseStatus.PROCESSING,
      title: 'Order placed',
      time: '07:13 02-04-2024',
      icon: <NotepadTextIcon size={30} color="#e55354" />,
    },
    {
      status: PurchaseStatus.PAID,
      title: 'Paid',
      time: '07:13 02-04-2024',
      icon: <CircleDollarSignIcon size={30} color="#e55354" />,
    },
    {
      status: PurchaseStatus.CONFIRMED,
      title: 'Confirmed',
      time: '07:13 02-04-2024',
      icon: <BadgeCheckIcon size={30} color="#e55354" />,
    },
    {
      status: PurchaseStatus.DELIVERING,
      title: 'Delivery in progress',
      time: '07:13 02-04-2024',
      icon: <TruckIcon size={30} color="#e55354" />,
    },
    {
      status: PurchaseStatus.RECEIVED,
      title: 'Completed',
      time: '07:13 02-04-2024',
      icon: <StarIcon size={30} color="#e55354" />,
    },
  ];

  const { session } = await validateRequest();
  if (!session) {
    return redirect('/auth');
  }
  const id = params.id;
  const order = await getOrderDetail(id);
  if (!order) {
    notFound();
  }

  const statusIndex = STATUS_ITEMS.findIndex(
    (item) => item.status === order.status
  );

  const activeIndex =
    statusIndex === -1 ? 0 : STATUS_ITEMS.length - statusIndex - 1;

  const totalPrice = await formatPriceSV(order.totalPrice);

  return (
    <div className="pb-[60px]">
      <div className="flex items-center border-b border-divider px-[24px] py-[16px]">
        <Link
          href={'/portal/orders'}
          className="flex items-center gap-2 text-base uppercase text-white"
        >
          <ChevronLeft /> Back
        </Link>
        <p className="ml-auto text-base uppercase text-white">
          Code: #{order.orderCode}
        </p>
        <div className="mx-4 h-[16px] w-[1px] bg-white" />
        <p className="text-base uppercase text-[#e55354]">{order.status}</p>
      </div>
      <div className="flex border-b border-divider">
        <div className="relative mx-auto flex gap-10 px-[24px] py-[40px]">
          <div
            className={
              'absolute left-[120px] top-1/2 -z-[1] h-[3px] translate-y-[calc(-50%-34px)] bg-[#e55354]'
            }
            style={{
              right: `calc(120px + ${180 * activeIndex}px)`,
            }}
          />
          {order.status !== PurchaseStatus.CANCELED ? (
            STATUS_ITEMS.map((item, index) => (
              <div key={index} className="flex w-[140px] flex-col items-start">
                <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-[#e55354] bg-[#0A0A0A]">
                  {item.icon}
                </div>
                <p className="mb-2 w-full text-center font-medium leading-5">
                  {item.title}
                </p>
              </div>
            ))
          ) : (
            <div className="flex w-[140px] flex-col items-start">
              <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-[#e55354] bg-[#0A0A0A]">
                <SquareSlashIcon size={30} color="#e55354" />
              </div>
              <p className="mb-2 w-full text-center font-medium leading-5">
                CANCELED
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="border-b border-divider px-[24px] py-[16px]">
        <h3 className="mb-4 text-base font-medium text-white">
          Delivery Address
        </h3>
        <p className="mb-3 text-sm">
          {order?.customer?.firstName + ' ' + order?.customer?.lastName}
        </p>
        <p className="mb-1 text-xs">{order?.customer?.phoneNumber}</p>
        <p className="text-xs">{order?.address?.address}</p>

        <p className="mt-3 text-sm text-white">
          <span className="font-medium">Note:</span> {order.note}
        </p>
      </div>
      <div className="flex flex-col gap-3 px-[24px] py-[40px]">
        {order.orderItems.map((item) => (
          <PurchasedItem key={item.id} data={item} />
        ))}
      </div>

      <p className="px-[24px] text-right text-[18px] font-medium text-[#e55354]">
        <span className="text-white">Total:</span> {totalPrice}
      </p>

      <Actions data={order} />
    </div>
  );
}

export default Page;
