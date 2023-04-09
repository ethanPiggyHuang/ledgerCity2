import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList } from './statisticsAPI';

interface LabelState {
  type: 'main' | 'sub';
  name: string;
}

export interface LedgerListState {
  ledgerTime: number;
  item: string;
  labels: LabelState[]; //TODO: can be simpler
  payWho: string;
  payHow: 'cash' | 'creditCard' | 'mobile';
  amount: { currency: string; number: number; numberNT: number }; //TODO currency exchange
  status: 'idle' | 'loading' | 'failed';
  imageUrl: string;
  recordTime: Date | undefined;
}

const initialState: LedgerListState = {
  ledgerTime: 0,
  item: '',
  labels: [{ type: 'main', name: '' }], //TODO: can be simpler
  payWho: '',
  payHow: 'cash',
  amount: { currency: 'NT', number: 0, numberNT: 0 },
  status: 'idle',
  imageUrl: '',
  recordTime: undefined,
};

export const getLedgerList = createAsyncThunk(
  'statistics/getLedgerList',
  async () => {
    const ledgerBookId: string = 'UcrgCxiJxo3oA7vvwYtd'; //TODO: import from other State
    const response = await fetchLedgerList(ledgerBookId);
    // return response.data;
  }
);

export const ledgerList = createSlice({
  name: 'ledgerList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLedgerList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLedgerList.fulfilled, (state, action) => {
        state.status = 'idle';
        console.log('fetch succeed');
        // state = { ...action.payload, status: 'idle' };
        return state;
      })
      .addCase(getLedgerList.rejected, (state) => {
        state.status = 'failed';
        alert('getLedgerList rejected');
      });
  },
});

// export const {} = GameMainInfo.actions;

export default ledgerList.reducer;
