import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageControlState {
  pageChosen: 'ledger' | 'statistics' | 'profile' | 'city';
  ledgerPosition: 'minimize' | 'normal' | 'expand';
  chartType: 'oneMonth' | 'monthly' | 'split';
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PageControlState = {
  pageChosen: 'city',
  ledgerPosition: 'minimize',
  chartType: 'oneMonth',
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
    CHANGE_CHART_TYPE: (
      state,
      action: PayloadAction<'oneMonth' | 'monthly' | 'split'>
    ) => {
      state.chartType = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { SWITCH_PAGE, CHANGE_LEDGER_POSITION, CHANGE_CHART_TYPE } =
  pageControl.actions;

export default pageControl.reducer;
