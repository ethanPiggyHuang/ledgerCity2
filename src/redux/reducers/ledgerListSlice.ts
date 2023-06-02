import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteSingleLedger } from '../api/ledgerListAPI';
import { RootState } from '../store';
import { LedgerDataState } from './ledgerSingleSlice';

interface LedgerListState {
  dataList: { ledgerId: string; data: LedgerDataState }[];
  choices: {
    chosenLedgerId: string;
    chosenYear: number;
    chosenMonth: number;
    chosenLabel: string;
    sortBy: 'date' | 'label' | 'value';
    sortDirection: 'ascending' | 'descending';
  };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LedgerListState = {
  dataList: [],
  choices: {
    chosenLedgerId: '',
    chosenYear: 0,
    chosenMonth: 0,
    chosenLabel: '',
    sortBy: 'date',
    sortDirection: 'ascending',
  },
  status: 'idle',
};

export const DELETE_SINGLE_LEDGER = createAsyncThunk(
  'ledgerList/DELETE_SINGLE_LEDGER',
  async (ledgerId: string, { getState }) => {
    const allStates = getState() as RootState;
    const cityId = allStates.userInfo.data.cityList[0];
    const ledgerBookId = allStates.city.basicInfo.ledgerBookId;
    const houses = allStates.city.basicInfo.houses;
    const newHouses = houses.filter((house) => house.ledgerId !== ledgerId);
    houses.forEach((house) => console.log(house.ledgerId !== ledgerId));
    await deleteSingleLedger(cityId, newHouses, ledgerBookId, ledgerId);
    return ledgerId;
  }
);

export const ledgerList = createSlice({
  name: 'ledgerList',
  initialState,
  reducers: {
    SET_CURRENT_MONTH: (
      state,
      action: PayloadAction<{ currentMonth: number; currentYear: number }>
    ) => {
      state.choices.chosenMonth = action.payload.currentMonth;
      state.choices.chosenYear = action.payload.currentYear;
    },
    CHOOSE_YEAR: (state, action: PayloadAction<number>) => {
      state.choices.chosenYear = action.payload;
    },
    CHOOSE_MONTH: (state, action: PayloadAction<number>) => {
      if (action.payload < 1) {
        state.choices.chosenMonth = 12;
        state.choices.chosenYear = state.choices.chosenYear - 1;
      } else if (action.payload > 12) {
        state.choices.chosenMonth = 1;
        state.choices.chosenYear = state.choices.chosenYear + 1;
      } else {
        state.choices.chosenMonth = action.payload;
      }
    },
    CHOOSE_LABEL: (state, action: PayloadAction<string>) => {
      state.choices.chosenLabel = action.payload;
    },
    UPDATE_LEDGER_LIST: (
      state,
      action: PayloadAction<{ ledgerId: string; data: LedgerDataState }[]>
    ) => {
      state.dataList = action.payload;
    },
    SORT_LIST: (state, action: PayloadAction<'date' | 'label' | 'value'>) => {
      if (action.payload === state.choices.sortBy) {
        state.choices.sortDirection =
          state.choices.sortDirection === 'ascending'
            ? 'descending'
            : 'ascending';
      } else {
        state.choices.sortBy = action.payload;
        state.choices.sortDirection = 'ascending';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DELETE_SINGLE_LEDGER.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(DELETE_SINGLE_LEDGER.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataList = state.dataList.filter(
          (ledger) => ledger.ledgerId !== action.payload
        );
        console.log('delete ledger complete');
      })
      .addCase(DELETE_SINGLE_LEDGER.rejected, (state) => {
        state.status = 'failed';
        alert('delete ledger rejected');
      });
  },
});

export const {
  SET_CURRENT_MONTH,
  CHOOSE_YEAR,
  CHOOSE_MONTH,
  CHOOSE_LABEL,
  UPDATE_LEDGER_LIST,
  SORT_LIST,
} = ledgerList.actions;

export default ledgerList.reducer;
