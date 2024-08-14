import { PurchaseStatus } from './enum';

export const purchaseTabs = [
  {
    title: 'All',
    keySearch: '',
  },
  // {
  //   title: 'Processing',
  //   keySearch: PurchaseStatus.PROCESSING,
  // },
  {
    title: 'Paid',
    keySearch: PurchaseStatus.PAID,
  },
  {
    title: 'Confirmed',
    keySearch: PurchaseStatus.CONFIRMED,
  },
  {
    title: 'Delivering',
    keySearch: PurchaseStatus.DELIVERING,
  },
  {
    title: 'Completed',
    keySearch: PurchaseStatus.RECEIVED,
  },
  {
    title: 'Canceled',
    keySearch: PurchaseStatus.CANCELED,
  },
];

export const MessageOfStatus = [
  {
    key: 'PROCESSING',
    status: 'TO CONFIRM',
    message: 'Order is awaiting confirmation',
    color: 'text-blue-500',
  },
  {
    key: 'PAID',
    status: 'PAID',
    message: 'Order has been paid',
    color: 'text-blue-500',
  },
  {
    key: 'CONFIRMED',
    status: 'CONFIRMED',
    message: 'Order has been confirmed',
    color: 'text-blue-500',
  },
  {
    key: 'DELIVERING',
    status: 'DELIVERING',
    message: 'Order is being delivered',
    color: 'text-blue-500',
  },
  {
    key: 'RECEIVED',
    status: 'RECEIVED',
    message: 'Order has been received',
    color: 'text-green-500',
  },
  {
    key: 'CANCELED',
    status: 'CANCELED',
    message: 'Order has been cancelled',
    color: 'text-red-400',
  },
];
