import { UserInFo } from '@/lucia-auth/auth-actions';
import { PaginationConfig } from './utils.type';

export interface ReviewType {
  id: number;
  creatorId: number;
  orderItemId: number;
  rating: number;
  comment: string;
  reply: string;
  createdAt: string;
  updatedAt: string;
  creator: UserInFo;
}

export interface ReviewListConfig extends PaginationConfig {
  productId: number;
}

export interface ReviewDataList {
  items: {
    rating: number;
    comment: string;
    orderItemId: number;
  }[];
}

export interface ReviewPostSchemaType {
  rating: number;
  comment: string;
  creatorId: string;
  orderItemId: number;
}
