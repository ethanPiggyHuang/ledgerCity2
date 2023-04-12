import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList } from '../api/ledgerListAPI';

export interface userInfoState {
  isLogin: boolean;
  status: 'idle' | 'loading' | 'failed';
  data: {
    user: {
      userId: string;
      userShortId: number;
      name: string;
      email: string;
      portraitUrl: string;
    };
    cityList: string[];
    friends: {
      userId: string;
      name: string;
      friendStatus: string;
      coorperateStatus: string;
      coorperateCityId: string;
    }[];
    subLabels: string[][];
    trophy: { list: number[]; citizens: number[] };
    gameSetting: { hasMusic: boolean; hints: boolean; timeZone?: number };
  };
}

const initialState: userInfoState = {
  isLogin: false,
  status: 'idle',
  data: {
    user: {
      userId: '',
      userShortId: 0,
      name: '',
      email: '',
      portraitUrl: '',
    },
    cityList: [],
    friends: [],
    subLabels: [[]],
    trophy: { list: [], citizens: [] },
    gameSetting: { hasMusic: false, hints: false, timeZone: 0 },
  },
};

// export const LOG_IN = createAsyncThunk(
//   'userInfo/LOG_IN',
//   async () => {
//     const ledgerBookId: string = 'UcrgCxiJxo3oA7vvwYtd'; //TODO: import from other State
//     const response = await fetchLedgerList(ledgerBookId, {
//       field: 'timeYear',
//       whereFilterOp: '>=',
//       value: 0,
//     });
//     const modifiedResponse = response.data.map((data) => {
//       const timeInSeconds = new Date(data.recordTime.seconds * 1000).getTime();
//       return { ...data, recordTime: timeInSeconds };
//     });
//     return modifiedResponse;
//   }
// );

export const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    LOGGED_IN: (state) => {
      state.isLogin = true;
    },
    LOG_OUT: (state) => {
      state.isLogin = false;
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

export const { LOGGED_IN, LOG_OUT } = userInfo.actions;

export default userInfo.reducer;
