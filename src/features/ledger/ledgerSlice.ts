import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { updateHousePosition } from './gameMapAPI';
// import { CityInfoState, HouseState } from './gameMapSlice';

interface LabelState {
  type: 'main' | 'sub';
  name: string;
}

interface LedgerSingleState {
  mode: 'manual' | 'qrCode' | 'cloud';
  // date: Date;
  item: string;
  labelChoosing: LabelState;
  labels: LabelState[];
  payWho: string;
  payHow: 'cash' | 'creditCard' | 'mobile';
  amount: { currency: string; number: number; numberNT: number }; //TODO
  statue: 'idle' | 'loading' | 'failed';
  imageUrl: string;
}

const initialState: LedgerSingleState = {
  mode: 'manual',
  // date: new Date(),
  item: '',
  labelChoosing: { type: 'main', name: 'food' },
  labels: [{ type: 'main', name: '' }],
  payWho: '',
  payHow: 'cash',
  amount: { currency: '', number: 0, numberNT: 0 },
  statue: 'idle',
  imageUrl: '',
};

// export const saveCityAsync = createAsyncThunk(
//   'city/saveCity',
//   async (houses: HouseState[], { getState }) => {
//     const cityId: string = 'YFbhq5M8vFBIUMMWZhqo'; //TODO: import from other State
//     const data = getState() as any; //TODO
//     const housesPosition: { type: number; id: string }[][] =
//       data.cityArrangement.housesPosition;
//     const houseIds = houses.map((house) => house.ledgerId);

//     let newPostions: { [key: string]: { x: number; y: number } } = {};
//     housesPosition.forEach((raw, yIndex) => {
//       raw.forEach((grid, xIndex) => {
//         const index = houseIds.findIndex((id) => id === grid.id);
//         if (index > -1) newPostions[grid.id] = { y: yIndex, x: xIndex };
//       });
//     });
//     const newHouses = houses.map((house) => {
//       return { ...house, position: newPostions[house.ledgerId] };
//     });

//     await updateHousePosition(cityId, newHouses);
//   }
// );

export const ledgerSingle = createSlice({
  name: 'ledgerSingle',
  initialState,
  reducers: {
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
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(saveCityAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(saveCityAsync.fulfilled, (state) => {
  //       state.status = 'idle';
  //       state.isHouseDraggable = false;
  //       alert('街道重建已紀錄');
  //       return state;
  //     })
  //     .addCase(saveCityAsync.rejected, (state) => {
  //       state.status = 'failed';
  //       alert('街道重建儲存失敗');
  //     });
  // },
});

export const { chooseLabelType, chooseLabel, deleteLabel } =
  ledgerSingle.actions;

export default ledgerSingle.reducer;
