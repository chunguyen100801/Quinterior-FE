import { AssetItemType } from './asset.type';

export interface CartItemType {
  cartId?: number;
  productId: number;
  quantity: number;
  product: AssetItemType;
}
