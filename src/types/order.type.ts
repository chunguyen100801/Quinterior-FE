import { UserInFo } from '@/lucia-auth/auth-actions';
import { AddressType } from './address.type';
import { PublisherInfoType } from './publisher.type';
import { MetaType, PaginationConfig } from './utils.type';
import { ReviewType } from './review.type';
import { AssetItemType } from './asset.type';
import { PurchaseStatus } from 'src/constants/enum';

export interface PurchaseListConfig extends PaginationConfig {
  type?: string;
  status?: string;
  order?: string;
  customerId?: number;
  sellerId?: number;
}
export interface OrderItemsType {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: AssetItemType;
  review: ReviewType;
}

export interface OrderType {
  id: number;
  orderCode: string;
  customerId: number;
  addressId: string;
  totalPrice: number;
  note: string;
  status: PurchaseStatus;
  paymentType: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  orderItems: OrderItemsType[];
  seller: PublisherInfoType;
  address: AddressType;
  customer: UserInFo;
}

export interface OrderListResponse {
  data: OrderType[];
  meta: MetaType;
}

export interface CreateOrderResponse {
  url: {
    finalVnpUrl: string;
  };
  orders: OrderType[];
}
