import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateHousePosition, pickRandomPosition } from '../api/cityAPI';
import { CityBasicInfoState } from './cityBasicInfoSlice';
import { RootState } from '../store';

export interface CityArrangementState {
  housesPosition: { type: string; id: string }[][];
  gridsStatus: number[][];
  dragMode: 'city' | 'houses';
  cityShift: {
    mouseStart: { x: number; y: number };
    dragStart: { x: number; y: number };
    current: { x: number; y: number };
  };
  cityScrollShift: {
    x: number;
    y: number;
  };
  cityKeyShift: {
    x: number;
    y: number;
  };
  isRelocateActivate: boolean;
  dragInfo: {
    id: string;
    target: string;
    pastIndex: { xIndex: number; yIndex: number };
  };
  nextHousePosition: { xIndex: number; yIndex: number };
  isRenaming: boolean;
  isTouring: boolean;
  isAddingNew: boolean;
  scale: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CityArrangementState = {
  housesPosition: [[{ type: '', id: '' }]],
  gridsStatus: [[0]],
  dragMode: 'city',
  cityShift: {
    mouseStart: { x: 0, y: 0 },
    dragStart: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  },
  cityScrollShift: { x: 0, y: 0 },
  cityKeyShift: { x: 0, y: 0 },
  isRelocateActivate: false,
  dragInfo: { id: '', target: '', pastIndex: { xIndex: 0, yIndex: 0 } },
  nextHousePosition: { xIndex: 0, yIndex: 0 },
  isRenaming: false,
  isTouring: false,
  isAddingNew: false,
  status: 'idle',
  scale: 1,
};

export const saveCityAsync = createAsyncThunk(
  'cityArrangement/saveCity',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const cityId = allStates.userInfo.data.cityList[0];
    const houses = allStates.cityBasicInfo.houses;
    const houseIds = houses.map((house) => house.ledgerId);
    const housesPosition = allStates.cityArrangement.housesPosition;

    let newPostions: { [key: string]: { xIndex: number; yIndex: number } } = {};
    housesPosition.forEach((raw, yIndex) => {
      raw.forEach((grid, xIndex) => {
        const index = houseIds.findIndex((id) => id === grid.id);
        if (index > -1) newPostions[grid.id] = { yIndex, xIndex };
      });
    });
    const newHouses = houses.map((house) => {
      return { ...house, position: newPostions[house.ledgerId] };
    });
    try {
      await updateHousePosition(cityId, newHouses);
    } catch (error) {
      console.log(error);
    }
  }
);

export const GENERATE_AVAILABLE_POSITION = createAsyncThunk(
  'cityArrangement/generateAvailablePosition',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const housesPosition = allStates.cityArrangement.housesPosition;

    let emptyPostions: { xIndex: number; yIndex: number }[] = [];
    housesPosition?.forEach((raw, yIndex) => {
      raw?.forEach((grid, xIndex) => {
        if (grid.type === '') {
          emptyPostions.push({ yIndex, xIndex });
        }
      });
    });

    try {
      const response = await pickRandomPosition(emptyPostions);
      if (response) return response.data;
    } catch (error) {
      console.log(error);
      return { xIndex: 0, yIndex: 0 };
    }
  }
);

export const cityArrangement = createSlice({
  name: 'cityArrangement',
  initialState,
  reducers: {
    displayCity: (state, action: PayloadAction<CityBasicInfoState>) => {
      const houses = action.payload.houses;
      if (houses.length !== 0) {
        const citySize = Math.ceil(Math.sqrt(houses.length));
        const RowNumber = citySize + 1;
        const ColumnNumber = citySize + 2;
        const newRows = new Array(RowNumber).fill('');
        const newHousesPosition = newRows.map((row) =>
          new Array(ColumnNumber).fill({ type: '', id: '' })
        );
        const newGridsStatus = new Array(RowNumber).fill(
          new Array(ColumnNumber).fill(0)
        );
        houses.forEach((house) => {
          newHousesPosition[house.position.yIndex][house.position.xIndex] = {
            type: house.type,
            id: house.ledgerId,
          };
        });

        state.housesPosition = newHousesPosition;
        state.gridsStatus = newGridsStatus;
      }
    },
    RECORD_DRAG_START: (
      state,
      action: PayloadAction<{
        mouseX: number;
        mouseY: number;
      }>
    ) => {
      state.cityShift.mouseStart.x = action.payload.mouseX;
      state.cityShift.mouseStart.y = action.payload.mouseY;
    },
    UPDATE_CITY_LOCATION: (
      state,
      action: PayloadAction<{
        mouseX: number;
        mouseY: number;
      }>
    ) => {
      const { x, y } = state.cityShift.mouseStart;
      const { mouseX, mouseY } = action.payload;
      const { current } = state.cityShift;
      const mouseShiftX = mouseX - x;
      const mouseShiftY = mouseY - y;
      current.x = current.x + mouseShiftX;
      current.y = current.y + mouseShiftY;
    },

    SET_CITY_LOCATION: (
      state,
      action: PayloadAction<{
        top: number;
        left: number;
      }>
    ) => {
      state.cityShift.current.x = action.payload.left;
      state.cityShift.current.y = action.payload.top;
    },
    CITY_RELOCATE: (
      state,
      action: PayloadAction<{
        shiftX: number;
        shiftY: number;
      }>
    ) => {
      state.cityShift.current.x =
        state.cityShift.current.x + action.payload.shiftX;
      state.cityShift.current.y =
        state.cityShift.current.y + action.payload.shiftY;
    },
    dropHouse: (
      state,
      action: PayloadAction<{
        yIndex: number;
        xIndex: number;
      }>
    ) => {
      const { yIndex, xIndex } = action.payload;
      const pastYIndex = state.dragInfo.pastIndex.yIndex;
      const pastXIndex = state.dragInfo.pastIndex.xIndex;
      if (state.housesPosition[yIndex][xIndex].type === '') {
        state.housesPosition[pastYIndex][pastXIndex] = { type: '', id: '' };
        state.housesPosition[yIndex][xIndex] = {
          type: state.dragInfo.target,
          id: state.dragInfo.id,
        };
        state.dragInfo.target = '';
        state.dragInfo.id = '';
      }
      for (let i = 0; i < state.gridsStatus.length; i++) {
        for (let j = 0; j < state.gridsStatus[i].length; j++) {
          state.gridsStatus[i][j] = 0;
        }
      }
    },
    dragHouseStart: (
      state,
      action: PayloadAction<{
        id: string;
        target: string;
        pastIndex: { xIndex: number; yIndex: number };
      }>
    ) => {
      state.dragInfo = {
        id: action.payload.id,
        target: action.payload.target,
        pastIndex: action.payload.pastIndex,
      };
    },
    dragLightOn: (
      state,
      action: PayloadAction<{
        yIndex: number;
        xIndex: number;
      }>
    ) => {
      const { xIndex, yIndex } = action.payload;
      const pastXIndex = state.dragInfo.pastIndex.xIndex;
      const pastYIndex = state.dragInfo.pastIndex.yIndex;

      if (state.dragInfo.target !== '') {
        if (
          (xIndex === pastXIndex && yIndex === pastYIndex) ||
          state.housesPosition[yIndex][xIndex].type === ''
        ) {
          state.gridsStatus[yIndex][xIndex] = 1;
        } else {
          state.gridsStatus[yIndex][xIndex] = -1;
        }
      }
    },
    dragLightOff: (state) => {
      for (let i = 0; i < state.gridsStatus.length; i++) {
        for (let j = 0; j < state.gridsStatus[i].length; j++) {
          state.gridsStatus[i][j] = 0;
        }
      }
    },
    draggableToggle: (state) => {
      state.dragMode = 'houses';
    },
    ADJUST_SCALE: (state, action: PayloadAction<number>) => {
      const minScale = 0.4;
      const maxScale = 2.5;
      if (state.scale < maxScale && action.payload > 1) {
        state.scale *= action.payload;
      } else if (state.scale > minScale && action.payload < 1) {
        state.scale *= action.payload;
      }
    },
    SET_SCALE: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    RENAME_CITY: (state, action: PayloadAction<boolean>) => {
      state.isRenaming = action.payload;
    },
    CITY_SET_SHIFT: (
      state,
      action: PayloadAction<{ shiftX: number; shiftY: number }>
    ) => {
      const { shiftX, shiftY } = action.payload;
      state.cityScrollShift.x = shiftX;
      state.cityScrollShift.y = shiftY;
      state.isRelocateActivate = true;
    },
    CITY_KEY_SHIFT: (
      state,
      action: PayloadAction<{ deltaX: number; deltaY: number }>
    ) => {
      const { deltaX, deltaY } = action.payload;
      state.cityKeyShift.x = state.cityKeyShift.x - deltaX;
      state.cityKeyShift.y = state.cityKeyShift.y - deltaY;
    },

    CITY_SHIFT_END: (state) => {
      state.isRelocateActivate = false;
    },
    START_CITY_TOUR: (state) => {
      state.isTouring = true;
    },
    END_CITY_TOUR: (state) => {
      state.isTouring = false;
      state.cityKeyShift.x = 0;
      state.cityKeyShift.y = 0;
    },
    CITY_SLOWLY_TRANSITION: (state, action: PayloadAction<boolean>) => {
      state.isAddingNew = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveCityAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveCityAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.dragMode = 'city';
        // console.log('街道重建已紀錄');
      })
      .addCase(saveCityAsync.rejected, (state) => {
        state.status = 'failed';
        alert('街道重建儲存失敗');
      })
      .addCase(GENERATE_AVAILABLE_POSITION.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(GENERATE_AVAILABLE_POSITION.fulfilled, (state, action) => {
        state.status = 'idle';
        const yIndex = action.payload?.yIndex;
        const xIndex = action.payload?.xIndex;
        if (yIndex && xIndex) {
          state.nextHousePosition = { yIndex, xIndex };
        }
        // console.log(`下次位置 y:${yIndex},x:${xIndex}`);
      })
      .addCase(GENERATE_AVAILABLE_POSITION.rejected, (state) => {
        state.status = 'failed';
        alert('尋找新空位失敗');
      });
  },
});

export const {
  displayCity,
  RECORD_DRAG_START,
  UPDATE_CITY_LOCATION,
  SET_CITY_LOCATION,
  CITY_RELOCATE,
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
  draggableToggle,
  ADJUST_SCALE,
  SET_SCALE,
  RENAME_CITY,
  CITY_KEY_SHIFT,
  CITY_SET_SHIFT,
  CITY_SHIFT_END,
  START_CITY_TOUR,
  END_CITY_TOUR,
  CITY_SLOWLY_TRANSITION,
} = cityArrangement.actions;

export default cityArrangement.reducer;
