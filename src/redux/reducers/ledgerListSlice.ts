import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList } from '../api/ledgerListAPI';

export interface LedgerListState {
  ledgerId: string;
  timeLedger: number;
  timeYear: number;
  timeMonth: number;
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
  choices: { ledgerId: string; year: number };
  status: 'idle' | 'loading' | 'failed';
} = {
  data: [
    {
      ledgerId: '',
      timeLedger: 0,
      timeYear: 0,
      timeMonth: 0,
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
  choices: { ledgerId: '', year: 2023 },
  status: 'idle',
};

export const getLedgerList = createAsyncThunk(
  'statistics/getLedgerList',
  async (year: number) => {
    const ledgerBookId: string = 'UcrgCxiJxo3oA7vvwYtd'; //TODO: import from other State
    const response = await fetchLedgerList(ledgerBookId, {
      field: 'timeYear',
      whereFilterOp: '==',
      value: year,
    });
    const modifiedResponse = response.data.map((data) => {
      const timeInSeconds = new Date(data.recordTime.seconds * 1000).getTime();
      return { ...data, recordTime: timeInSeconds };
    });
    return modifiedResponse;
  }
);

export const ledgerList = createSlice({
  name: 'ledgerList',
  initialState,
  reducers: {
    chooseTarget: (
      state,
      action: PayloadAction<{ targetType: string; targetValue: string }>
    ) => {
      console.log(action.payload.targetValue);
      if (action.payload.targetType === 'ledgerId')
        state.choices.ledgerId = action.payload.targetValue;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLedgerList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLedgerList.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
        console.log('fetch succeed');
      })
      .addCase(getLedgerList.rejected, (state) => {
        state.status = 'failed';
        alert('getLedgerList rejected');
      });
  },
});

export const { chooseTarget } = ledgerList.actions;

export default ledgerList.reducer;
