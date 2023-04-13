import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList } from '../api/ledgerListAPI';

export interface userInfoState {
  loginStatus: {
    isLogin: boolean;
    isAuthing: boolean;
    isLoading: boolean;
  };
  status: 'idle' | 'loading' | 'failed';
  data: {
    user: {
      userId: string;
      userShortId: number;
      name: string | null;
      email: string | null;
      portraitUrl: string | null;
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
  loginStatus: {
    isLogin: false,
    isAuthing: true,
    isLoading: false,
  },
  status: 'idle',
  data: {
    user: {
      userId: '',
      userShortId: 0,
      name: null,
      email: null,
      portraitUrl: null,
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
    AUTHING_TOGGLE: (state, action: PayloadAction<boolean>) => {
      state.loginStatus.isAuthing = action.payload;
    },
    LOGGED_IN: (
      state,
      action: PayloadAction<{
        uid: string;
        displayName: string | null;
        email: string | null;
        photoURL: string | null;
      }>
    ) => {
      const { uid, displayName, email, photoURL } = action.payload;
      const user = {
        userId: uid,
        userShortId: 12345678,
        name: displayName,
        email: email,
        portraitUrl: photoURL,
      };
      state.loginStatus.isLogin = true;
      state.data.user = user;
    },
    LOG_OUT: (state) => {
      const user = {
        userId: '',
        userShortId: 0,
        name: null,
        email: null,
        portraitUrl: null,
      };
      state.loginStatus.isLogin = false;
      state.data.user = user;
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

export const { AUTHING_TOGGLE, LOGGED_IN, LOG_OUT } = userInfo.actions;

export default userInfo.reducer;
