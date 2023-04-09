import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postLedger } from './ledgerAPI';

interface LabelState {
  type: 'main' | 'sub';
  name: string;
}

export interface LedgerSingleState {
  mode: 'manual' | 'qrCode' | 'cloud';
  ledgerTime: number;
  item: string;
  labelChoosing: LabelState;
  labels: LabelState[]; //TODO: can be simpler
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

const time = new Date().getTime();

const initialState: LedgerSingleState = {
  mode: 'manual',
  ledgerTime: time,
  item: '',
  labelChoosing: { type: 'main', name: '' },
  labels: [{ type: 'main', name: '' }],
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
      ledgerTime,
      item,
      labels,
      payWho,
      payHow,
      amount: { number },
      imageUrl,
    } = ledgerSingle;
    const ledgerData = {
      ledgerTime,
      item,
      labels,
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
      return {
        ...state,
        item: action.payload,
      };
    },
    labelChooseType: (state, action: PayloadAction<'main' | 'sub'>) => {
      if (state.labelChoosing.type !== action.payload) {
        return {
          ...state,
          labelChoosing: { type: action.payload, name: '' },
        };
      }
    },
    labelChoose: (state, action: PayloadAction<string>) => {
      if (state.labelChoosing.type === 'main') {
        return {
          ...state,
          labelChoosing: { type: 'main', name: action.payload },
          labels: [
            { type: 'main', name: action.payload },
            ...state.labels.slice(1, state.labels.length),
          ],
        };
      }
      //TODO: case 次要標籤
    },
    labelRetrieve: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        labelChoosing: { type: 'main', name: '' },
        labels: [
          ...state.labels.slice(0, action.payload),
          ...state.labels.slice(action.payload + 1),
        ],
      };
      //TODO: case 次要標籤
    },
    amountKeyNumber: (state, action: PayloadAction<string>) => {
      const pastNumberString = state.amount.number.toString();
      const pastHolderNumberString = state.calculationHolder.number.toString();
      // if (pastNumberString.length > 12) {
      //   alert('動用「一兆元」以上資金！？恭喜您已財富自由！');
      //   return state;
      // }
      if (state.calculationHolder.operator === '') {
        return {
          ...state,
          amount: {
            ...state.amount,
            number: Number(pastNumberString + action.payload),
          },
        };
      } else {
        return {
          ...state,
          calculationHolder: {
            ...state.calculationHolder,
            number: Number(pastHolderNumberString + action.payload),
          },
        };
      }
    },
    amountDelete: (state) => {
      const pastNumberString = state.amount.number.toString();
      const pastHolderNumberString = state.calculationHolder.number.toString();
      if (state.calculationHolder.operator === '') {
        return {
          ...state,
          amount: {
            ...state.amount,
            number: Number(
              pastNumberString.slice(0, pastNumberString.length - 1)
            ),
          },
        };
      } else if (pastHolderNumberString === '0') {
        return {
          ...state,
          calculationHolder: {
            ...state.calculationHolder,
            operator: '',
          },
        };
      } else {
        return {
          ...state,
          calculationHolder: {
            ...state.calculationHolder,
            number: Number(
              pastHolderNumberString.slice(0, pastHolderNumberString.length - 1)
            ),
          },
        };
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
      return {
        ...state,
        calculationHolder: {
          operator: action.payload,
          number: newNumber,
        },
      };
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
      return {
        ...state,
        amount: {
          ...state.amount,
          number: result,
        },
        calculationHolder: {
          operator: '',
          number: 0,
        },
      };
    },
    amountAllClear: (state) => {
      return {
        ...state,
        amount: {
          ...state.amount,
          number: 0,
        },
        calculationHolder: {
          operator: '',
          number: 0,
        },
      };
    },
    paySelectPerson: (state, action: PayloadAction<string>) => {
      if (state.payWho !== action.payload) {
        return {
          ...state,
          payWho: action.payload,
        };
      }
      return { ...state };
    },
    paySelectMethod: (
      state,
      action: PayloadAction<'cash' | 'creditCard' | 'mobile'>
    ) => {
      if (state.payHow !== action.payload) {
        return {
          ...state,
          payHow: action.payload,
        };
      }
      return { ...state };
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

      const now = new Date().getTime();
      if (newTimeInSeconds > now) alert('注意，未來日期！');

      return {
        ...state,
        ledgerTime: newTimeInSeconds,
      };
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
        state.labelChoosing = { type: 'main', name: '' };
        state.labels = [{ type: 'main', name: '' }];
        state.amount = { currency: '', number: 0, numberNT: 0 };
        state.calculationHolder = {
          operator: '',
          number: 0,
        };
        state.imageUrl = '';
        return state;
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
