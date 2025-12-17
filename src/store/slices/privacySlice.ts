import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PrivacyState = {
  locationEnabled: boolean;
  userDisabledLocation: boolean;
  isHydrated: boolean;
};

const initialState: PrivacyState = {
  locationEnabled: false,
  userDisabledLocation: false,
  isHydrated: false,
};

const privacySlice = createSlice({
  name: 'privacy',
  initialState,
  reducers: {
    setLocationEnabled: (s, a: PayloadAction<boolean>) => {
      s.locationEnabled = a.payload;
    },
    setUserDisabledLocation: (s, a: PayloadAction<boolean>) => {
      s.userDisabledLocation = a.payload;
    },
    setHydrated: (s, a: PayloadAction<boolean>) => {
      s.isHydrated = a.payload;
    },
  },
});

export const { setLocationEnabled, setUserDisabledLocation, setHydrated } = privacySlice.actions;
export default privacySlice.reducer;
