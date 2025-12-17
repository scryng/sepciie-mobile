// store/qrScannerSlice.ts
import { processQRData } from '@/utils/decryptQRCode';
import { ProcessedResult } from '@/utils/fetchMockAPI';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Async thunk para processar QR Code
export const processQRCode = createAsyncThunk('qrScanner/processQRCode', async (qrData: string, { rejectWithValue }) => {
  try {
    const result = await processQRData(qrData);
    return result;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido ao processar QR Code');
  }
});

// Estados possíveis da aplicação
export type QRScannerState = 'initial' | 'scanning' | 'processing' | 'result' | 'error';

interface QRCodeScannerState {
  state: QRScannerState;
  scanning: boolean;
  processing: boolean;
  result: ProcessedResult | null;
  error: string | null;
  facing: 'back' | 'front';
  hasPermission: boolean;
}

const initialState: QRCodeScannerState = {
  state: 'initial',
  scanning: false,
  processing: false,
  result: null,
  error: null,
  facing: 'back',
  hasPermission: false,
};

const qrScannerSlice = createSlice({
  name: 'qrScanner',
  initialState,
  reducers: {
    // Inicia o processo de escaneamento
    startScanning: (state) => {
      state.state = 'scanning';
      state.scanning = true;
      state.result = null;
      state.error = null;
      state.processing = false;
    },

    // Para o escaneamento
    stopScanning: (state) => {
      state.state = 'initial';
      state.scanning = false;
    },

    // Reseta o scanner para estado inicial
    resetScanner: (state) => {
      state.state = 'initial';
      state.scanning = false;
      state.processing = false;
      state.result = null;
      state.error = null;
    },

    // Alterna a câmera frontal/traseira
    toggleCameraFacing: (state) => {
      state.facing = state.facing === 'back' ? 'front' : 'back';
    },

    // Define o status da permissão da câmera
    setPermission: (state, action: PayloadAction<boolean>) => {
      state.hasPermission = action.payload;
    },

    // Limpa apenas o erro
    clearError: (state) => {
      state.error = null;
      if (state.state === 'error') {
        state.state = 'initial';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Processamento do QR Code iniciado
      .addCase(processQRCode.pending, (state) => {
        state.state = 'processing';
        state.scanning = false;
        state.processing = true;
        state.error = null;
      })
      // Processamento bem-sucedido
      .addCase(processQRCode.fulfilled, (state, action) => {
        state.state = 'result';
        state.processing = false;
        state.result = action.payload;
        state.error = null;
      })
      // Erro no processamento
      .addCase(processQRCode.rejected, (state, action) => {
        state.state = 'error';
        state.processing = false;
        state.error = action.payload as string;
        state.result = null;
      });
  },
});

export const { startScanning, stopScanning, resetScanner, toggleCameraFacing, setPermission, clearError } = qrScannerSlice.actions;

export default qrScannerSlice.reducer;
