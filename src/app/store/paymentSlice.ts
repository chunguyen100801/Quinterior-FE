import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CartItemType } from 'src/types/cart.type';
interface State {
  data: CartItemType[];
}
const initialState: State = {
  data: [],
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentData: (state, action: PayloadAction<CartItemType[]>) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPaymentData } = paymentSlice.actions;

export default paymentSlice.reducer;
