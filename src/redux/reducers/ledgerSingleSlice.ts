import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postLedger } from '../api/ledgerSingleAPI';

export interface LedgerSingleState {
  mode: 'manual' | 'qrCode' | 'cloud';
  timeLedger: number;
  item: string;
  labelChoosingType: 'main' | 'sub';
  labelMain: string;
  labelSubs: string[];
  payWho: string;
  payHow: 'cash' | 'creditCard' | 'mobile';
  amount: { currency: string; number: number; numberNT: number }; //TODO currency exchange
  calculationHolder: {
    operator: '' | '+' | '-' | 'x' | '÷';
    number: number;
  };
  status: 'idle' | 'loading' | 'failed';
  imageUrl: string;
}

const now = new Date().getTime(); //TODO ESSENTIAL: Reducers Must Not Have Side Effects

const initialState: LedgerSingleState = {
  mode: 'manual',
  timeLedger: now,
  item: '',
  labelChoosingType: 'main',
  labelMain: '',
  labelSubs: [],
  payWho: 'Ethan', // TODO: 要改掉！
  payHow: 'cash',
  amount: { currency: '', number: 0, numberNT: 0 },
  calculationHolder: {
    operator: '',
    number: 0,
  },
  status: 'idle',
  imageUrl: '',
};

export const ledgerSubmit = createAsyncThunk(
  'ledger/ledgerSubmit',
  async (arg, { getState }) => {
    const allStates = getState() as any; //TODO typeScript
    const ledgerSingle = allStates.ledgerSingle as LedgerSingleState;
    const {
      timeLedger,
      item,
      labelMain,
      labelSubs,
      payWho,
      payHow,
      amount: { number },
      imageUrl,
    } = ledgerSingle;
    const ledgerData = {
      timeLedger,
      timeYear: new Date(timeLedger).getFullYear(),
      timeMonth: new Date(timeLedger).getMonth() + 1,
      item,
      labelMain,
      labelSubs,
      payWho,
      payHow,
      amount: {
        currency: 'NT',
        number,
        numberNT: number,
      },
      imageUrl,
      recordWho: 'Ethan', //TODO: import from Account State
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

export const ledgerSingle = createSlice({
  name: 'ledgerSingle',
  initialState,
  reducers: {
    itemKeyIn: (state, action: PayloadAction<string>) => {
      state.item = action.payload;
    },
    labelChooseType: (state, action: PayloadAction<'main' | 'sub'>) => {
      if (state.labelChoosingType !== action.payload)
        state.labelChoosingType = action.payload;
    },
    labelChoose: (state, action: PayloadAction<string>) => {
      if (state.labelChoosingType === 'main') {
        state.labelMain = action.payload;
      }
      //TODO: case 次要標籤
    },
    labelRetrieve: (state, action: PayloadAction<string>) => {
      if (state.labelMain === action.payload) {
        state.labelMain = '';
      } else {
        //TODO: case 次要標籤
        const removeIndex = state.labelSubs.indexOf(action.payload);
        state.labelSubs = [
          ...state.labelSubs.slice(0, removeIndex),
          ...state.labelSubs.slice(removeIndex + 1),
        ];
      }
    },
    amountKeyNumber: (state, action: PayloadAction<string>) => {
      const pastNumberString = state.amount.number.toString();
      const pastHolderNumberString = state.calculationHolder.number.toString();
      // TODO: 需要限制數字的位數
      // if (pastNumberString.length > 12) {
      //   alert('動用「一兆元」以上資金！？恭喜您已財富自由！');
      //   return state;
      // }
      if (state.calculationHolder.operator === '') {
        state.amount.number = Number(pastNumberString + action.payload);
      } else {
        state.calculationHolder.number = Number(
          pastHolderNumberString + action.payload
        );
      }
    },
    amountDelete: (state) => {
      const pastNumberString = state.amount.number.toString();
      const pastHolderNumberString = state.calculationHolder.number.toString();
      if (state.calculationHolder.operator === '') {
        state.amount.number = Number(
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
      const numberBeforeOperator = state.amount.number;
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
      state.amount.number = result;
      state.calculationHolder.operator = '';
      state.calculationHolder.number = 0;
    },
    amountAllClear: (state) => {
      state.amount.number = 0;
      state.calculationHolder.operator = '';
      state.calculationHolder.number = 0;
    },
    paySelectPerson: (state, action: PayloadAction<string>) => {
      state.payWho = action.payload;
    },
    paySelectMethod: (
      state,
      action: PayloadAction<'cash' | 'creditCard' | 'mobile'>
    ) => {
      state.payHow = action.payload;
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
      const newTimeInSeconds = time.getTime();
      const now = new Date().getTime(); //TODO ESSENTIAL: Reducers Must Not Have Side Effects
      if (newTimeInSeconds > now) alert('注意，未來日期！');

      state.timeLedger = newTimeInSeconds;
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
        state.item = '';
        state.labelChoosingType = 'main';
        state.labelMain = '';
        state.labelSubs = [];
        state.amount = { currency: '', number: 0, numberNT: 0 };
        state.calculationHolder = {
          operator: '',
          number: 0,
        };
        state.imageUrl = '';
      })
      .addCase(ledgerSubmit.rejected, (state) => {
        state.status = 'failed';
        alert('登錄失敗');
      });
  },
});

export const {
  itemKeyIn,
  labelChooseType,
  labelChoose,
  labelRetrieve,
  amountKeyNumber,
  amountDelete,
  amountHoldOperator,
  amountCalculate,
  amountAllClear,
  paySelectPerson,
  paySelectMethod,
  timeEdit,
} = ledgerSingle.actions;

export default ledgerSingle.reducer;
