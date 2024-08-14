import { toast } from 'sonner';
import { CartItemType } from 'src/types/cart.type';

export function getAssetInCarṭ̣̣̣̣̣(assetId: number, cart: CartItemType[]) {
  return cart.find((item) => item.productId === assetId);
}

export function checkAssetQuantity(
  assetId: number,
  cart: CartItemType[],
  quantityInventory: number,
  quantity: number
) {
  const cartItem = getAssetInCarṭ̣̣̣̣̣(assetId, cart);
  return cartItem ? quantityInventory >= cartItem.quantity + quantity : true;
}

export function checkCanAddToCart(
  checkLogin: () => boolean,
  assetId: number,
  data: CartItemType[],
  quantityInventory: number,
  quantity: number,
  isBuying = false
) {
  const checklogin = checkLogin();
  if (!checklogin) {
    return false;
  }

  if (
    checkAssetQuantity(assetId, data, quantityInventory, quantity) === false
  ) {
    isBuying === false &&
      toast.error(
        'The quantity of this Product in the shopping cart cannot be greater than the quantity in stock'
      );
    return false;
  }
  if (quantity < 1) {
    toast.error("Quantity can't be less than 1");
    return false;
  } else if (quantity > quantityInventory) {
    toast.error("Quantity can't be greater than quantity in stock");
    return false;
  }
  return true;
}

export const formatNumberToAbbreviation = (num: number, precision = 2) => {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num;
};
