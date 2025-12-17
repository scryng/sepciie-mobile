// store/slices/authSlice.ts
import { AuthLoginUserData } from '@/types/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  currentUser: AuthLoginUserData | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<AuthLoginUserData | null>) => {
      state.currentUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearAuth: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
      state.isLoading = false;
    },
  },
});

export const { setLoginStatus, setCurrentUser, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
