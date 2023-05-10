import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createLedger, updateLedger } from '../api/ledgerSingleAPI';
import { RootState } from '../store';

export interface LedgerDataState {
  timeLedger: number;
  timeMonth: number;
  timeYear: number;
  item: string;
  labelMain: string;
  labelSubs: string[];
  payWho: string;
  payHow: 'cash' | 'creditCard' | 'mobile';
  amount: { currency: string; number: number; numberNT: number };
  recordTime: number;
  recordWho: string;
}

export interface LedgerSingleState {
  ledgerId: string;
  data: LedgerDataState;
  calculationHolder: {
    operator: '' | '+' | '-' | 'x' | '÷';
    number: number;
    isLong: boolean;
    errorType: '' | 'maximum' | 'negative';
  };
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LedgerSingleState = {
  ledgerId: '',
  data: {
    timeLedger: 0,
    timeMonth: 0,
    timeYear: 0,
    item: '',
    labelMain: '食物',
    labelSubs: [],
    payWho: '',
    payHow: 'cash',
    amount: { currency: '', number: 0, numberNT: 0 },
    recordTime: 0,
    recordWho: '',
  },
  calculationHolder: {
    operator: '',
    number: 0,
    isLong: false,
    errorType: '',
  },
  status: 'idle',
};

export const SUBMIT_LEDGER = createAsyncThunk(
  'ledger/SUBMIT_LEDGER',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const ledgerSingle = allStates.ledgerSingle;
    const data = ledgerSingle.data;
    const ledgerBookId = allStates.city.basicInfo.ledgerBookId;
    const cityId = allStates.userInfo.data.cityList[0];
    const { userId } = allStates.userInfo.data;
    const ledgerData = {
      ...data,
      recordWho: userId,
    };
    const { nextHousePosition } = allStates.city;

    await createLedger(cityId, ledgerBookId, ledgerData, nextHousePosition);
  }
);

export const UPDATE_LEDGER = createAsyncThunk(
  'ledger/UPDATE_LEDGER',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const ledgerBookId = allStates.city.basicInfo.ledgerBookId;
    const { userId } = allStates.userInfo.data;
    const { ledgerId, data } = allStates.ledgerSingle;

    const updateData = {
      ...data,
      recordWho: userId,
    };
    await updateLedger(ledgerBookId, ledgerId, updateData);
  }
);

export const ledgerSingle = createSlice({
  name: 'ledgerSingle',
  initialState,
  reducers: {
    CLEAR_LEDGER_INPUTS: (state) => {
      state.ledgerId = '';
      state.data.item = '';
      state.data.amount.number = 0;
    },
    EDIT_LEDGER: (
      state,
      action: PayloadAction<{
        ledgerId: string;
        data: LedgerDataState;
      }>
    ) => {
      state.ledgerId = action.payload.ledgerId;
      state.data = action.payload.data;
    },
    TYPE_ITEM: (state, action: PayloadAction<string>) => {
      state.data.item = action.payload;
    },
    CHOOSE_LABEL: (state, action: PayloadAction<string>) => {
      state.data.labelMain = action.payload;
    },
    PRESS_NUMBER: (state, action: PayloadAction<string>) => {
      const pastNumberString = state.data.amount.number.toString();
      const pastHolderNumberString = state.calculationHolder.number.toString();
      const maximumLength = 8;
      if (state.calculationHolder.operator === '') {
        if ((pastNumberString + action.payload).length > maximumLength) {
          state.data.amount.number = Number(pastNumberString);
          state.calculationHolder.errorType = 'maximum';
        } else {
          state.data.amount.number = Number(pastNumberString + action.payload);
        }
      } else {
        if ((pastHolderNumberString + action.payload).length > maximumLength) {
          state.calculationHolder.number = Number(pastHolderNumberString);
          state.calculationHolder.errorType = 'maximum';
        } else {
          state.calculationHolder.number = Number(
            pastHolderNumberString + action.payload
          );
        }
      }
    },
    PRESS_DELETE: (state) => {
      const pastNumberString = state.data.amount.number.toString();
      const pastHolderNumberString = state.calculationHolder.number.toString();
      if (state.calculationHolder.operator === '') {
        state.data.amount.number = Number(
          pastNumberString.slice(0, pastNumberString.length - 1)
        );
      } else if (pastHolderNumberString === '0') {
        state.calculationHolder.operator = '';
      } else {
        state.calculationHolder.number = Number(
          pastHolderNumberString.slice(0, pastHolderNumberString.length - 1)
        );
      }
    },
    PRESS_OPERATOR: (
      state,
      action: PayloadAction<'' | '+' | '-' | 'x' | '÷'>
    ) => {
      const newNumber =
        state.calculationHolder.operator === action.payload
          ? state.calculationHolder.number
          : 0;
      state.calculationHolder.operator = action.payload;
      state.calculationHolder.number = newNumber;
    },
    EXECUTE_CALCULATION: (state) => {
      const numberBeforeOperator = state.data.amount.number;
      const { number, operator } = state.calculationHolder;
      let result: number;
      switch (operator) {
        case '+': {
          result = numberBeforeOperator + number;
          break;
        }
        case '-': {
          result = numberBeforeOperator - number;
          break;
        }
        case 'x': {
          result = numberBeforeOperator * number;
          break;
        }
        case '÷': {
          result = numberBeforeOperator / number;
          break;
        }
        default: {
          result = numberBeforeOperator;
        }
      }
      const maximum = 99999999;
      if (result > maximum) {
        state.data.amount.number = numberBeforeOperator;
        state.calculationHolder.errorType = 'maximum';
      } else if (result < 0) {
        state.data.amount.number = numberBeforeOperator;
        state.calculationHolder.errorType = 'negative';
      } else {
        state.data.amount.number = result;
      }
      state.calculationHolder.operator = '';
      state.calculationHolder.number = 0;
    },
    CLEAR_AMOUNT: (state) => {
      state.data.amount.number = 0;
      state.calculationHolder.operator = '';
      state.calculationHolder.number = 0;
    },
    TOGGLE_AMOUNT_LENGTH: (state, action: PayloadAction<boolean>) => {
      state.calculationHolder.isLong = action.payload;
    },
    CLEAR_AMOUNT_ERROR: (state) => {
      state.calculationHolder.errorType = '';
    },
    SWITCH_PAY_PEOPLE: (
      state,
      action: PayloadAction<{ name: string; list: string[]; init?: boolean }>
    ) => {
      const { name, list, init } = action.payload;
      if (init) {
        state.data.payWho = name;
      }
      const index = list.findIndex((personName) => personName === name);
      state.data.payWho = list[(index + 1) % list.length];
    },
    SWITCH_PAY_METHOD: (
      state,
      action: PayloadAction<'cash' | 'creditCard' | 'mobile'>
    ) => {
      const options: ('cash' | 'creditCard' | 'mobile')[] = [
        'cash',
        'creditCard',
        'mobile',
      ];
      const index = options.findIndex((option) => option === action.payload);
      state.data.payHow = options[(index + 1) % options.length];
    },
    SWITCH_TIME: (
      state,
      action: PayloadAction<{ prevTime: number; scope: string; delta: number }>
    ) => {
      const { prevTime, scope, delta } = action.payload;
      const time = new Date(prevTime);
      switch (scope) {
        case 'date': {
          const prevDate = time.getDate();
          time.setDate(prevDate + delta);
          break;
        }
        case 'month': {
          const prevMonth = time.getMonth();
          time.setMonth(prevMonth + delta);
          break;
        }
        case 'year': {
          const prevYear = time.getFullYear();
          time.setFullYear(prevYear + delta);
          break;
        }
        default: {
        }
      }

      state.data.timeLedger = time.getTime();
      state.data.timeMonth = time.getMonth() + 1;
      state.data.timeYear = time.getFullYear();
    },
    SET_CURRENT_TIME: (state, action: PayloadAction<number>) => {
      state.data.timeLedger = action.payload;
      state.data.timeMonth = new Date(action.payload).getMonth() + 1;
      state.data.timeYear = new Date(action.payload).getFullYear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SUBMIT_LEDGER.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(SUBMIT_LEDGER.fulfilled, (state) => {
        state.status = 'idle';
        state.data.item = '';
        state.data.labelMain = '食物';
        state.data.labelSubs = [];
        state.data.amount = { currency: '', number: 0, numberNT: 0 };
        state.calculationHolder = {
          operator: '',
          number: 0,
          isLong: false,
          errorType: '',
        };
      })
      .addCase(SUBMIT_LEDGER.rejected, (state) => {
        state.status = 'failed';
        alert('登錄失敗');
      })
      .addCase(UPDATE_LEDGER.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(UPDATE_LEDGER.fulfilled, (state) => {
        state.status = 'idle';
        state.data.item = '';
        state.data.labelMain = '食物';
        state.data.labelSubs = [];
        state.data.amount = { currency: '', number: 0, numberNT: 0 };
        state.calculationHolder = {
          operator: '',
          number: 0,
          isLong: false,
          errorType: '',
        };
        state.ledgerId = '';
      })
      .addCase(UPDATE_LEDGER.rejected, (state) => {
        state.status = 'failed';
        alert('更新失敗');
      });
  },
});

export const {
  CLEAR_LEDGER_INPUTS,
  EDIT_LEDGER,
  TYPE_ITEM,
  CHOOSE_LABEL,
  PRESS_NUMBER,
  PRESS_DELETE,
  PRESS_OPERATOR,
  EXECUTE_CALCULATION,
  CLEAR_AMOUNT,
  TOGGLE_AMOUNT_LENGTH,
  SWITCH_PAY_PEOPLE,
  SWITCH_PAY_METHOD,
  SWITCH_TIME,
  SET_CURRENT_TIME,
  CLEAR_AMOUNT_ERROR,
} = ledgerSingle.actions;

export default ledgerSingle.reducer;
