import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FETCH_COORPERATE_LOCATION } from '../api/userAPI';
import { DocumentData } from '@firebase/firestore-types';

interface SoloUserActivityState {
  currentPage: 'city' | 'ledger' | 'statistics' | 'profile' | 'leave';
  fadeOutTime: number;
  isEditingCity: boolean;
  latestActiveTime: number;
}

export interface UsersActivityState {
  status: 'idle' | 'loading' | 'failed';
  data: { [userId: string]: SoloUserActivityState };
}

const initialState: UsersActivityState = {
  status: 'idle',
  data: {
    //TODO 這邊要好好調整如何設定初始值
    myCPVIkcOYalDVvdj9hngfml3yq2: {
      currentPage: 'city',
      fadeOutTime: 0,
      isEditingCity: false,
      latestActiveTime: 0,
    },
    zLXmF0iGASbeYEJwdnEUk96BJ8u1: {
      currentPage: 'city',
      fadeOutTime: 0,
      isEditingCity: false,
      latestActiveTime: 0,
    },
  },
};

// not yet used
export const GET_LOCATION = createAsyncThunk(
  'usersActivity/GET_LOCATION',
  async () => {
    // const userId = 'myCPVIkcOYalDVvdj9hngfml3yq2';
    // const response = await FETCH_COORPERATE_LOCATION(userId);
    // const modifiedResponse = response.data.map((data) => {
    //   const timeInSeconds = new Date(data.recordTime.seconds * 1000).getTime();
    //   return { ...data, recordTime: timeInSeconds };
    // });
    // return modifiedResponse;
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
        const {
          userId,
          currentPage,
          isEditingCity,
          fadeOutTimeSecond,
          latestActiveTimeSecond,
        } = action.payload;

        state.data[userId].currentPage = currentPage;
        state.data[userId].isEditingCity = isEditingCity;
        state.data[userId].fadeOutTime = fadeOutTimeSecond;
        state.data[userId].latestActiveTime = latestActiveTimeSecond;
      }
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getLedgerList.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(getLedgerList.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.data = action.payload;
  //     })
  //     .addCase(getLedgerList.rejected, (state) => {
  //       state.status = 'failed';
  //       alert('getLedgerList rejected');
  //     });
  // },
});

export const { GET_COOP_FRIEND_ACTIVITY } = usersActivity.actions;

export default usersActivity.reducer;
