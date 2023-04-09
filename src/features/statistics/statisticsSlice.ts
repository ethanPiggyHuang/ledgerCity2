import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList } from './statisticsAPI';

export interface LedgerListState {
  timeLedger: number;
  item: string;
  labelMain: string;
  labelSubs: string[];
  payWho: string;
  payHow: 'cash' | 'creditCard' | 'mobile';
  amount: { currency: string; number: number; numberNT: number }; //TODO currency exchange
  imageUrl: string;
  recordTime: number;
}

const initialState: {
  data: LedgerListState[];
  status: 'idle' | 'loading' | 'failed';
} = {
  data: [
    {
      timeLedger: 0,
      item: '',
      labelMain: '',
      labelSubs: [],
      payWho: '',
      payHow: 'cash',
      amount: { currency: 'NT', number: 0, numberNT: 0 },
      imageUrl: '',
      recordTime: 0,
    },
  ],
  status: 'idle',
};

export const getLedgerList = createAsyncThunk(
  'statistics/getLedgerList',
  async () => {
    const ledgerBookId: string = 'UcrgCxiJxo3oA7vvwYtd'; //TODO: import from other State
    const response = await fetchLedgerList(ledgerBookId);
    const modifiedResponse = response.data.map((data) => {
      const timeInSeconds = new Date(data.recordTime.seconds * 1000).getTime();
      return { ...data, recordTime: timeInSeconds };
    });
    console.log(modifiedResponse);

    return modifiedResponse;
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
        state.data = action.payload;
        console.log('fetch succeed');
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
