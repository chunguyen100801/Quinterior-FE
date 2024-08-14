import { UserInFo } from '@/lucia-auth/auth-actions';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import StorageKeys from 'src/constants/storage';
export interface AuthInfo {
  isLogin: boolean;
  userInfo: UserInFo | null;
}
const initialState: AuthInfo = {
  isLogin: false,
  userInfo: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInFo: (state, action: PayloadAction<UserInFo | null>) => {
      const userInfo = action.payload;

      if (userInfo) {
        state.userInfo = userInfo;
        localStorage.setItem(StorageKeys.USER_INFO, JSON.stringify(userInfo));
      } else {
        state.userInfo = null;
        localStorage.removeItem(StorageKeys.USER_INFO);
      }
    },
    loginSetState: (state) => {
      state.isLogin = true;
    },
    logoutSetState: (state) => {
      state.isLogin = false;
    },
    AutoLogin: () => {
      return;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginSetState, logoutSetState, setUserInFo } = authSlice.actions;

export default authSlice.reducer;
