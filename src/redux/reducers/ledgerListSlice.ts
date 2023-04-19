import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList, deleteLedger } from '../api/ledgerListAPI';
import { LedgerDataState } from './ledgerSingleSlice';
import { RootState } from '../store';

interface LedgerListState {
  dataList: { ledgerId: string; data: LedgerDataState }[];
  choices: {
    chosenLedgerId: string;
    chosenYear: number;
    chosenMonth: number;
    chosenLabel: string;
  };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LedgerListState = {
  dataList: [],
  choices: {
    chosenLedgerId: '',
    chosenYear: 2023,
    chosenMonth: 0,
    chosenLabel: '',
  },
  status: 'idle',
};

export const getLedgerList = createAsyncThunk(
  'statistics/getLedgerList',
  async (ledgerBookId: string) => {
    const response = await fetchLedgerList(ledgerBookId, {
      field: 'timeYear',
      whereFilterOp: '>=',
      value: 0,
    });
    const modifiedResponse = response.dataList.map((ledger) => {
      const timeInSeconds = new Date(
        ledger.data.recordTime.seconds * 1000
      ).getTime();
      return {
        ledgerId: ledger.ledgerId,
        data: { ...ledger.data, recordTime: timeInSeconds },
      };
    });
    return modifiedResponse;
  }
);

export const deleteSingleLedger = createAsyncThunk(
  'statistics/deleteSingleLedger',
  async (ledgerId: string, { getState }) => {
    const allStates = getState() as RootState;
    const cityId = allStates.userInfo.data.cityList[0];
    const ledgerBookId = allStates.cityBasicInfo.ledgerBookId;
    const houses = allStates.cityBasicInfo.houses;
    const newHouses = houses.filter((house) => house.ledgerId !== ledgerId);
    houses.forEach((house) => console.log(house.ledgerId !== ledgerId));
    // console.log(newHouses);
    await deleteLedger(cityId, newHouses, ledgerBookId, ledgerId);
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
    UPDATE_LEDGER_LIST: (
      state,
      action: PayloadAction<{ ledgerId: string; data: LedgerDataState }[]>
    ) => {
      state.dataList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLedgerList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLedgerList.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataList = action.payload;
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
        state.dataList = state.dataList.filter(
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

export const { chooseYear, chooseMonth, chooseLabel, UPDATE_LEDGER_LIST } =
  ledgerList.actions;

export default ledgerList.reducer;
