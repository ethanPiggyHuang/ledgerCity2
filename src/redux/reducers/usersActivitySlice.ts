import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FETCH_COORPERATE_LOCATION,
  fetchFrinedInfo,
  updateCityAccessibility,
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
    userId: string;
    userName: string | null;
    userNickName: string | null;
    userEmail: string | null;
    userPortraitUrl: string | null;
  }[];
  data: { [userId: string]: SoloUserActivityState } | {};
}

const initialState: UsersActivityState = {
  status: 'idle',
  friendsInfo: [],
  data: {},
};

export const GET_FRIENDS_INFO = createAsyncThunk(
  'userInfo/GET_FRIENDS_INFO',
  async (friendId: string) => {
    console.log('here', friendId);
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
    const { userId, friendId, cityId } = payload;
    console.log(friendId);
    const response = await updateCityAccessibility(userId, friendId, cityId);

    // return response?.data;
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
          console.log(action.payload);
          state.friendsInfo = [...state.friendsInfo, action.payload];
        }
      })
      .addCase(GET_FRIENDS_INFO.rejected, (state) => {
        state.status = 'failed';
        alert('get friend info failed');
      })
      .addCase(AGREE_COOPERATIONS.pending, (state) => {
        state.status = 'loading';
        //要跳出提示「帳號創建中」
      })
      .addCase(AGREE_COOPERATIONS.fulfilled, (state, action) => {
        state.status = 'idle';
        console.log('succeed');
      })
      .addCase(AGREE_COOPERATIONS.rejected, (state) => {
        state.status = 'failed';
        alert('agree cooperaton failed');
      });
  },
});

export const { GET_COOP_FRIEND_ACTIVITY } = usersActivity.actions;

export default usersActivity.reducer;
