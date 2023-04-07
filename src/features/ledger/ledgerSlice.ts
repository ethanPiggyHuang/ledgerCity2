import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { updateHousePosition } from './gameMapAPI';
// import { CityInfoState, HouseState } from './gameMapSlice';

interface LabelState {
  type: 'main' | 'sub';
  name: string;
}

interface LedgerSingleState {
  mode: 'manual' | 'qrCode' | 'cloud';
  ledgerDate: Date;
  recordDate: Date;
  item: string;
  labelChoosing: LabelState;
  labels: LabelState[];
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

const now = new Date(); //TODO

const initialState: LedgerSingleState = {
  mode: 'manual',
  ledgerDate: now,
  recordDate: now,
  item: '',
  labelChoosing: { type: 'main', name: 'food' },
  labels: [{ type: 'main', name: '' }],
  payWho: '',
  payHow: 'cash',
  amount: { currency: '', number: 0, numberNT: 0 },
  calculationHolder: {
    operator: '',
    number: 0,
  },
  status: 'idle',
  imageUrl: '',
};

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
    chooseLabelType: (state, action: PayloadAction<'main' | 'sub'>) => {
      if (state.labelChoosing.type !== action.payload) {
        return {
          ...state,
          labelChoosing: { type: action.payload, name: '' },
        };
      }
    },
    chooseLabel: (state, action: PayloadAction<string>) => {
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
    deleteLabel: (state, action: PayloadAction<number>) => {
      return {
        ...state,
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
  },
});

export const {
  itemKeyIn,
  chooseLabelType,
  chooseLabel,
  deleteLabel,
  amountKeyNumber,
  amountDelete,
  amountHoldOperator,
  amountCalculate,
  amountAllClear,
} = ledgerSingle.actions;

export default ledgerSingle.reducer;
