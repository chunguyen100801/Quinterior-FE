import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SearchInfo {
  imageSearch: string | null;
}

const initialState: SearchInfo = {
  imageSearch: null,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setImageSearch: (state, action: PayloadAction<string | null>) => {
      state.imageSearch = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setImageSearch } = searchSlice.actions;

export default searchSlice.reducer;
