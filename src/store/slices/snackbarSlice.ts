import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
    visible: boolean;
    title: string | null;
    message: string | null;
    messageType: string | null,
    duration: number | null,
}

const initialState: SnackbarState = {
    visible: false,
    title: null,
    message: null,
    messageType: null,
    duration: null,
};

type ShowMessagePayload = {
    messageType: string;
    message: string;
    title?: string;
    duration?: number;
}

const snackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        showMessage: (state, action: PayloadAction<ShowMessagePayload>) => {
            state.visible = true;
            state.messageType = action.payload.messageType;
            state.message = action.payload.message;
            state.title = action.payload.title ?? null;
            state.duration = action.payload.duration ?? null;
        },

        hideMessage: (state) => {
            state.visible = false;
            state.message = null;
            state.duration = null;
        },
    },
});

export const { showMessage, hideMessage } = snackbarSlice.actions;
export default snackbarSlice.reducer;