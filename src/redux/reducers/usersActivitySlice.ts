import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFrinedInfo } from '../api/userAPI';

export type CurrentActionState =
  | 'city'
  | 'rearrange'
  | 'ledger'
  | 'statistics'
  | 'profile'
  | 'leave';

interface SoloUserActivityState {
  lastActivity: CurrentActionState;
  currentActivity: CurrentActionState;
  fadeOutTimeSecond: number;
  latestActiveTimeSecond: number;
}

export interface FriendInfoState {
  userId: string;
  userName: string;
  userNickName: string;
  userEmail: string;
  userPortraitUrl: string;
}

export interface UsersActivityState {
  status: 'idle' | 'loading' | 'failed';
  friendsInfo: {
    [key: string]: FriendInfoState;
  };
  friendsCityName: { [key: string]: string };
  coopInfo: { [key: string]: SoloUserActivityState };
}

const initialState: UsersActivityState = {
  status: 'idle',
  friendsInfo: {},
  friendsCityName: {},
  coopInfo: {},
};

export const GET_FRIENDS_INFO = createAsyncThunk(
  'userInfo/GET_FRIENDS_INFO',
  async (friendId: string) => {
    const response = await fetchFrinedInfo(friendId);

    return response?.friendInfo;
  }
);

export const usersActivity = createSlice({
  name: 'usersActivity',
  initialState,
  reducers: {
    GET_COOP_FRIEND_ACTIVITY: (
      state,
      action: PayloadAction<{
        friendId: string;
        data: {
          currentActivity: CurrentActionState;
          fadeOutTimeSecond: number;
          latestActiveTimeSecond: number;
        };
      }>
    ) => {
      if (action.payload) {
        const { friendId } = action.payload;
        const { currentActivity, fadeOutTimeSecond, latestActiveTimeSecond } =
          action.payload.data;
        const lastActivity =
          state.coopInfo[friendId]?.currentActivity || 'city';
        state.coopInfo[friendId] = {
          currentActivity,
          fadeOutTimeSecond,
          latestActiveTimeSecond,
          lastActivity,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GET_FRIENDS_INFO.pending, (state) => {
        state.status = 'loading';
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
      });
  },
});

export const { GET_COOP_FRIEND_ACTIVITY } = usersActivity.actions;

export default usersActivity.reducer;
