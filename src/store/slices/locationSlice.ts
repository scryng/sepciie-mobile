import { createSlice } from "@reduxjs/toolkit";
import * as Location from 'expo-location';

type LocationState = {
  showBackgroundLocationPage: boolean,
}

const initialState: LocationState = {
  showBackgroundLocationPage: false,
}

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    showBackgroundLocationPage: (state) => {
      return {
        ...state,
        showBackgroundLocationPage: true,
      };
    },

    hideBackgroundLocationPage: (state) => {
      return {
        ...state,
        showBackgroundLocationPage: false,
      };
    },
  },
});

export const { hideBackgroundLocationPage, showBackgroundLocationPage } = locationSlice.actions;
export default locationSlice.reducer;