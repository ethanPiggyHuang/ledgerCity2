import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import api from '../../utils/firebase';

export interface HouseState {
  type: string;
  position: { xIndex: number; yIndex: number };
  height: number;
  ledgerId: string;
}

export interface CityBasicInfoState {
  accessUsers: string[];
  citizen: string[];
  cityName: string;
  houses: HouseState[];
  ledgerBookId: string;
}

export interface CityState {
  basicInfo: CityBasicInfoState;
  housesPosition: { type: string; id: string }[][];
  gridsStatus: number[][];
  dragMode: 'city' | 'houses';
  cityScrollShift: {
    x: number;
    y: number;
  };
  cityKeyShift: {
    x: number;
    y: number;
  };
  isCityScrollable: boolean;
  houseDragInfo: {
    id: string;
    target: string;
    pastIndex: { xIndex: number; yIndex: number };
  };
  nextHousePosition: { xIndex: number; yIndex: number };
  isRenaming: boolean;
  isTouring: boolean;
  isAddingNewHouse: boolean;
  scale: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CityState = {
  basicInfo: {
    accessUsers: [],
    citizen: [],
    cityName: '',
    houses: [],
    ledgerBookId: '',
  },
  housesPosition: [[{ type: '', id: '' }]],
  gridsStatus: [[0]],
  dragMode: 'city',
  cityScrollShift: { x: 0, y: 0 },
  cityKeyShift: { x: 0, y: 0 },
  isCityScrollable: false,
  houseDragInfo: { id: '', target: '', pastIndex: { xIndex: 0, yIndex: 0 } },
  nextHousePosition: { xIndex: 0, yIndex: 0 },
  isRenaming: false,
  isTouring: false,
  isAddingNewHouse: false,
  status: 'idle',
  scale: 1,
};

export const UPDATE_HOUSE_ARRANGEMENT = createAsyncThunk(
  'city/UPDATE_HOUSE_ARRANGEMENT',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const cityId = allStates.userInfo.data.cityList[0];
    const houses = allStates.city.basicInfo.houses;
    const houseIds = houses.map((house) => house.ledgerId);
    const housesPosition = allStates.city.housesPosition;

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
      await api.city.updateHouseArrangement(cityId, newHouses);
      console.log('eeee');
    } catch (error) {
      console.log(error);
    }
  }
);

export const GENERATE_AVAILABLE_POSITION = createAsyncThunk(
  'city/GENERATE_AVAILABLE_POSITION',
  async (arg, { getState }) => {
    const allStates = getState() as RootState;
    const housesPosition = allStates.city.housesPosition;

    let emptyPostions: { xIndex: number; yIndex: number }[] = [];
    housesPosition?.forEach((raw, yIndex) => {
      raw?.forEach((grid, xIndex) => {
        if (grid.type === '') {
          emptyPostions.push({ yIndex, xIndex });
        }
      });
    });

    const randomNumber = Math.floor(Math.random() * emptyPostions.length);
    return emptyPostions[randomNumber];
  }
);

export const UPDATE_CITY_NAME = createAsyncThunk(
  'city/UPDATE_CITY_NAME',
  async (payload: { cityId: string; cityName: string }) => {
    try {
      const { cityId, cityName } = payload;
      await api.city.updateCityName(cityId, cityName);
    } catch (error) {
      console.log(error);
    }
  }
);

export const city = createSlice({
  name: 'city',
  initialState,
  reducers: {
    GET_CITY_INFO: (state, action: PayloadAction<CityBasicInfoState>) => {
      state.basicInfo.cityName = action.payload.cityName;
      state.basicInfo.accessUsers = action.payload.accessUsers;
      state.basicInfo.citizen = action.payload.citizen;
      state.basicInfo.houses = action.payload.houses;
      state.basicInfo.ledgerBookId = action.payload.ledgerBookId;
      state.status = 'idle';
    },
    TYPE_CITY_NAME: (state, action: PayloadAction<string>) => {
      state.basicInfo.cityName = action.payload;
    },
    RENDER_CITY: (state, action: PayloadAction<CityBasicInfoState>) => {
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
    DROP_HOUSE: (
      state,
      action: PayloadAction<{
        yIndex: number;
        xIndex: number;
      }>
    ) => {
      const { yIndex, xIndex } = action.payload;
      const pastYIndex = state.houseDragInfo.pastIndex.yIndex;
      const pastXIndex = state.houseDragInfo.pastIndex.xIndex;
      if (state.housesPosition[yIndex][xIndex].type === '') {
        state.housesPosition[pastYIndex][pastXIndex] = { type: '', id: '' };
        state.housesPosition[yIndex][xIndex] = {
          type: state.houseDragInfo.target,
          id: state.houseDragInfo.id,
        };
        state.houseDragInfo.target = '';
        state.houseDragInfo.id = '';
      }
      for (let i = 0; i < state.gridsStatus.length; i++) {
        for (let j = 0; j < state.gridsStatus[i].length; j++) {
          state.gridsStatus[i][j] = 0;
        }
      }
    },
    DRAG_HOUSE_START: (
      state,
      action: PayloadAction<{
        id: string;
        target: string;
        pastIndex: { xIndex: number; yIndex: number };
      }>
    ) => {
      state.houseDragInfo = {
        id: action.payload.id,
        target: action.payload.target,
        pastIndex: action.payload.pastIndex,
      };
    },
    SWITCH_GRID_LIGHT_ON: (
      state,
      action: PayloadAction<{
        yIndex: number;
        xIndex: number;
      }>
    ) => {
      const { xIndex, yIndex } = action.payload;
      const pastXIndex = state.houseDragInfo.pastIndex.xIndex;
      const pastYIndex = state.houseDragInfo.pastIndex.yIndex;

      if (state.houseDragInfo.target !== '') {
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
    SWITCH_GRID_LIGHT_OFF: (state) => {
      for (let i = 0; i < state.gridsStatus.length; i++) {
        for (let j = 0; j < state.gridsStatus[i].length; j++) {
          state.gridsStatus[i][j] = 0;
        }
      }
    },
    TOGGLE_HOUSE_DRAGGABLE: (state) => {
      state.dragMode = 'houses';
    },
    SET_SCALE: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    RENAME_CITY: (state, action: PayloadAction<boolean>) => {
      state.isRenaming = action.payload;
    },
    SHIFT_CITY_VIA_SCROLL: (
      state,
      action: PayloadAction<{ shiftX: number; shiftY: number }>
    ) => {
      const { shiftX, shiftY } = action.payload;
      state.cityScrollShift.x = shiftX;
      state.cityScrollShift.y = shiftY;
      state.isCityScrollable = true;
    },
    SHIFT_CITY_VIA_KEYBOARD: (
      state,
      action: PayloadAction<{ deltaX: number; deltaY: number }>
    ) => {
      const { deltaX, deltaY } = action.payload;
      state.cityKeyShift.x = state.cityKeyShift.x - deltaX;
      state.cityKeyShift.y = state.cityKeyShift.y - deltaY;
    },

    END_CITY_SHIFT: (state) => {
      state.isCityScrollable = false;
    },
    START_CITY_TOUR: (state) => {
      state.isTouring = true;
    },
    END_CITY_TOUR: (state) => {
      state.isTouring = false;
      state.cityKeyShift.x = 0;
      state.cityKeyShift.y = 0;
    },
    SWITCH_CITY_TRANSITION_MODE: (state, action: PayloadAction<boolean>) => {
      state.isAddingNewHouse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UPDATE_HOUSE_ARRANGEMENT.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(UPDATE_HOUSE_ARRANGEMENT.fulfilled, (state) => {
        state.status = 'idle';
        state.dragMode = 'city';
        // console.log('街道重建已紀錄');
      })
      .addCase(UPDATE_HOUSE_ARRANGEMENT.rejected, (state) => {
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
      })
      .addCase(UPDATE_CITY_NAME.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(UPDATE_CITY_NAME.fulfilled, (state) => {
        alert('city name updated');
        state.status = 'idle';
      })
      .addCase(UPDATE_CITY_NAME.rejected, (state) => {
        state.status = 'failed';
        alert('update city name failed');
      });
  },
});

export const {
  GET_CITY_INFO,
  TYPE_CITY_NAME,
  RENDER_CITY,
  DROP_HOUSE,
  DRAG_HOUSE_START,
  SWITCH_GRID_LIGHT_ON,
  SWITCH_GRID_LIGHT_OFF,
  TOGGLE_HOUSE_DRAGGABLE,
  SET_SCALE,
  RENAME_CITY,
  SHIFT_CITY_VIA_SCROLL,
  SHIFT_CITY_VIA_KEYBOARD,
  END_CITY_SHIFT,
  START_CITY_TOUR,
  END_CITY_TOUR,
  SWITCH_CITY_TRANSITION_MODE,
} = city.actions;

export default city.reducer;
