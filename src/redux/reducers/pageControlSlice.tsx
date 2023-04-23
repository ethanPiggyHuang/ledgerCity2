import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageControlState {
  pageChosen: 'ledger' | 'statistics' | 'profile' | 'city';
  ledgerPosition: 'minimize' | 'normal' | 'expand';
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PageControlState = {
  pageChosen: 'city',
  ledgerPosition: 'minimize',
  status: 'idle',
};

export const pageControl = createSlice({
  name: 'cityBasicInfo',
  initialState,
  reducers: {
    SWITCH_PAGE: (
      state,
      action: PayloadAction<'ledger' | 'statistics' | 'profile'>
    ) => {
      state.pageChosen = action.payload;
    },
    CHANGE_LEDGER_POSITION: (
      state,
      action: PayloadAction<'minimize' | 'normal' | 'expand'>
    ) => {
      state.ledgerPosition = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { SWITCH_PAGE, CHANGE_LEDGER_POSITION } = pageControl.actions;

export default pageControl.reducer;
