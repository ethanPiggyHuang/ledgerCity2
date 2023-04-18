import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList, deleteLedger } from '../api/ledgerListAPI';

export interface LedgerSingleState {
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

interface LedgerListState {
  data: LedgerSingleState[];
  choices: {
    ledgerId: string;
    chosenYear: number;
    chosenMonth: number;
    chosenLabel: string;
  };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LedgerListState = {
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
  choices: { ledgerId: '', chosenYear: 2023, chosenMonth: 0, chosenLabel: '' },
  status: 'loading',
};

export const getLedgerList = createAsyncThunk(
  'statistics/getLedgerList',
  async () => {
    const ledgerBookId: string = 'UcrgCxiJxo3oA7vvwYtd'; //TODO: import from other State
    const response = await fetchLedgerList(ledgerBookId, {
      field: 'timeYear',
      whereFilterOp: '>=',
      value: 0,
    });
    const modifiedResponse = response.data.map((data) => {
      const timeInSeconds = new Date(data.recordTime.seconds * 1000).getTime();
      return { ...data, recordTime: timeInSeconds };
    });
    return modifiedResponse;
  }
);

export const deleteSingleLedger = createAsyncThunk(
  'statistics/deleteSingleLedger',
  async (ledgerId: string) => {
    const ledgerBookId: string = 'UcrgCxiJxo3oA7vvwYtd'; //TODO: import from other State
    await deleteLedger(ledgerBookId, ledgerId);
    return ledgerId;
  }
);

export const ledgerList = createSlice({
  name: 'ledgerList',
  initialState,
  reducers: {
    chooseYear: (state, action: PayloadAction<number>) => {
      state.choices.chosenYear = action.payload;
    },
    chooseMonth: (state, action: PayloadAction<number>) => {
      state.choices.chosenMonth = action.payload;
    },
    chooseLabel: (state, action: PayloadAction<string>) => {
      state.choices.chosenLabel = action.payload;
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
      })
      .addCase(getLedgerList.rejected, (state) => {
        state.status = 'failed';
        alert('getLedgerList rejected');
      })
      .addCase(deleteSingleLedger.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSingleLedger.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = state.data.filter(
          (ledger) => ledger.ledgerId !== action.payload
        );
        console.log('delete ledger complete');
      })
      .addCase(deleteSingleLedger.rejected, (state) => {
        state.status = 'failed';
        alert('delete ledger rejected');
      });
  },
});

export const { chooseYear, chooseMonth, chooseLabel } = ledgerList.actions;

export default ledgerList.reducer;
