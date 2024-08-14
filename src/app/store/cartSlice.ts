import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CartItemType } from 'src/types/cart.type';
export interface CartInfo {
  data: CartItemType[];
  isOpen: boolean;
  viewItemId: number | null;
  productBuyNow: number | null;
}
const initialState: CartInfo = {
  data: [],
  isOpen: false,
  viewItemId: null,
  productBuyNow: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItemType[]>) => {
      state.data = action.payload;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    viewCartItem: (state, action: PayloadAction<number | null>) => {
      state.viewItemId = action.payload;
    },
    setProductBuyNow: (state, action: PayloadAction<number | null>) => {
      state.productBuyNow = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCart, openCart, closeCart, viewCartItem, setProductBuyNow } =
  cartSlice.actions;

export default cartSlice.reducer;
