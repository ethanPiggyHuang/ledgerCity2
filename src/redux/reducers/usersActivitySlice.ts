import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FETCH_COORPERATE_LOCATION,
  fetchFrinedInfo,
  AGREE_TO_COOPERATION,
} from '../api/userAPI';
import { DocumentData } from '@firebase/firestore-types';
import { RootState } from '../store';

interface SoloUserActivityState {
  currentPage: 'city' | 'ledger' | 'statistics' | 'profile' | 'leave';
  fadeOutTime: number;
  isEditingCity: boolean;
  latestActiveTime: number;
}

export interface UsersActivityState {
  status: 'idle' | 'loading' | 'failed';
  friendsInfo: {
    [key: string]: {
      userId: string;
      userName: string | null;
      userNickName: string | null;
      userEmail: string | null;
      userPortraitUrl: string | null;
    };
  };
  data: { [userId: string]: SoloUserActivityState } | {};
}

const initialState: UsersActivityState = {
  status: 'idle',
  friendsInfo: {},
  data: {},
};

export const GET_FRIENDS_INFO = createAsyncThunk(
  'userInfo/GET_FRIENDS_INFO',
  async (friendId: string) => {
    const response = await fetchFrinedInfo(friendId);

    return response?.data;
  }
);

export const AGREE_COOPERATIONS = createAsyncThunk(
  'userInfo/AGREE_COOPERATIONS',
  async (
    payload: { userId: string; friendId: string; cityId: string },
    { getState }
  ) => {
    const allStates = getState() as RootState;
    const cityList = allStates.userInfo.data.cityList;
    const { userId, friendId, cityId } = payload;
    const newCityList = [cityId, ...cityList];
    console.log(friendId);
    await AGREE_TO_COOPERATION(userId, friendId, cityId, newCityList);
  }
);

export const usersActivity = createSlice({
  name: 'usersActivity',
  initialState,
  reducers: {
    GET_COOP_FRIEND_ACTIVITY: (
      state,
      action: PayloadAction<{
        userId: string;
        currentPage: 'city' | 'ledger' | 'statistics' | 'profile' | 'leave';
        isEditingCity: boolean;
        fadeOutTimeSecond: number;
        latestActiveTimeSecond: number;
      }>
    ) => {
      if (action.payload) {
        // const { userId } = action.payload;
        // state.data[userId] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GET_FRIENDS_INFO.pending, (state) => {
        state.status = 'loading';
        //要跳出提示「帳號創建中」
      })
      .addCase(GET_FRIENDS_INFO.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload) {
          const { userId } = action.payload;
          state.friendsInfo[userId] = action.payload;
        }
      })
      .addCase(GET_FRIENDS_INFO.rejected, (state) => {
        state.status = 'failed';
        alert('get friend info failed');
      })
      .addCase(AGREE_COOPERATIONS.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(AGREE_COOPERATIONS.fulfilled, (state) => {
        state.status = 'idle';
        alert('agreement succeed');
      })
      .addCase(AGREE_COOPERATIONS.rejected, (state) => {
        state.status = 'failed';
        alert('agree cooperaton failed');
      });
  },
});

export const { GET_COOP_FRIEND_ACTIVITY } = usersActivity.actions;

export default usersActivity.reducer;
