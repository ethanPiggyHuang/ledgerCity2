import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageControlState {
  ledgerPosition: 'minimize' | 'normal' | 'expand';
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PageControlState = {
  ledgerPosition: 'normal',
  status: 'idle',
};

export const pageControl = createSlice({
  name: 'cityBasicInfo',
  initialState,
  reducers: {
    CHANGE_LEDGER_POSITION: (
      state,
      action: PayloadAction<'minimize' | 'normal' | 'expand'>
    ) => {
      state.ledgerPosition = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { CHANGE_LEDGER_POSITION } = pageControl.actions;

export default pageControl.reducer;
