import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postLedger, updateLedger } from '../api/ledgerSingleAPI';
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
  amount: { currency: string; number: number; numberNT: number }; //TODO: currency exchange
  recordTime: number;
  recordWho: string;
}

export interface LedgerSingleState {
  ledgerId: string;
  data: LedgerDataState;
  calculationHolder: {
    operator: '' | '+' | '-' | 'x' | '÷';
    number: number;
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
    labelMain: '',
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
  },
  status: 'idle',
};

export const ledgerSubmit = createAsyncThunk(
  'ledger/ledgerSubmit',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const ledgerSingle = allStates.ledgerSingle;
    const data = ledgerSingle.data;
    const { userId } = allStates.userInfo.data.user;
    const ledgerData = {
      ...data,
      recordWho: userId,
    };
    const availableGrids: { yIndex: number; xIndex: number }[] = [];
    const housesPosition = allStates.cityArrangement.housesPosition as {
      type: string;
      id: string;
    }[][];
    housesPosition.forEach((raw, yIndex) => {
      raw.forEach((grid, xIndex) => {
        if (grid.type === '') availableGrids.push({ yIndex, xIndex });
      });
    });
    console.log('available', availableGrids);
    if (availableGrids.length === 0) alert('not enough grids'); //TODO: auto expand grid
    await postLedger(ledgerData, availableGrids);
  }
);

export const ledgerUpdate = createAsyncThunk(
  'ledger/ledgerUpdate',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const ledgerBookId = 'UcrgCxiJxo3oA7vvwYtd';
    const { userId } = allStates.userInfo.data.user;
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
    ledgerEdit: (
      state,
      action: PayloadAction<{
        ledgerId: string;
        data: LedgerDataState;
      }>
    ) => {
      state.ledgerId = action.payload.ledgerId;
      state.data = action.payload.data;
    },
    itemKeyIn: (state, action: PayloadAction<string>) => {
      state.data.item = action.payload;
    },
    labelChooseMain: (state, action: PayloadAction<string>) => {
      state.data.labelMain = action.payload;

      //TODO: case 次要標籤
    },
    labelRetrieve: (state, action: PayloadAction<string>) => {
      if (state.data.labelMain === action.payload) {
        state.data.labelMain = '';
      } else {
        //TODO: case 次要標籤
        state.data.labelSubs = state.data.labelSubs.filter(
          (labelSub) => labelSub !== action.payload
        );
      }
    },
    amountKeyNumber: (state, action: PayloadAction<string>) => {
      const pastNumberString = state.data.amount.number.toString();
      const pastHolderNumberString = state.calculationHolder.number.toString();
      // TODO: 需要限制數字的位數
      // if (pastNumberString.length > 12) {
      //   alert('動用「一兆元」以上資金！？恭喜您已財富自由！');
      //   return state;
      // }
      if (state.calculationHolder.operator === '') {
        state.data.amount.number = Number(pastNumberString + action.payload);
      } else {
        state.calculationHolder.number = Number(
          pastHolderNumberString + action.payload
        );
      }
    },
    amountDelete: (state) => {
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
    amountHoldOperator: (
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
    amountCalculate: (state) => {
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
      state.data.amount.number = result;
      state.calculationHolder.operator = '';
      state.calculationHolder.number = 0;
    },
    amountAllClear: (state) => {
      state.data.amount.number = 0;
      state.calculationHolder.operator = '';
      state.calculationHolder.number = 0;
    },
    paySelectPerson: (state, action: PayloadAction<string>) => {
      state.data.payWho = action.payload;
    },
    paySelectMethod: (
      state,
      action: PayloadAction<'cash' | 'creditCard' | 'mobile'>
    ) => {
      state.data.payHow = action.payload;
    },
    timeEdit: (
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
      // const now = new Date().getTime(); //TODO ESSENTIAL: Reducers Must Not Have Side Effects
      // if (newTimeInSeconds > now) alert('注意，未來日期！');
      state.data.timeLedger = time.getTime();
      state.data.timeMonth = time.getMonth() + 1;
      state.data.timeYear = time.getFullYear();
    },
    timeInitialize: (state, action: PayloadAction<number>) => {
      state.data.timeLedger = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ledgerSubmit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(ledgerSubmit.fulfilled, (state) => {
        state.status = 'idle';
        alert('已登錄');
        state.data.item = '';
        state.data.labelMain = '';
        state.data.labelSubs = [];
        state.data.amount = { currency: '', number: 0, numberNT: 0 };
        state.calculationHolder = {
          operator: '',
          number: 0,
        };
      })
      .addCase(ledgerSubmit.rejected, (state) => {
        state.status = 'failed';
        alert('登錄失敗');
      })
      .addCase(ledgerUpdate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(ledgerUpdate.fulfilled, (state) => {
        state.status = 'idle';
        alert('已登錄');
        state.data.item = '';
        state.data.labelMain = '';
        state.data.labelSubs = [];
        state.data.amount = { currency: '', number: 0, numberNT: 0 };
        state.calculationHolder = {
          operator: '',
          number: 0,
        };
        state.ledgerId = '';
      })
      .addCase(ledgerUpdate.rejected, (state) => {
        state.status = 'failed';
        alert('更新失敗');
      });
  },
});

export const {
  ledgerEdit,
  itemKeyIn,
  labelChooseMain,
  labelRetrieve,
  amountKeyNumber,
  amountDelete,
  amountHoldOperator,
  amountCalculate,
  amountAllClear,
  paySelectPerson,
  paySelectMethod,
  timeEdit,
  timeInitialize,
} = ledgerSingle.actions;

export default ledgerSingle.reducer;
