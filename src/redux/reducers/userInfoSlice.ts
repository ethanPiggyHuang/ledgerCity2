import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLedgerList } from '../api/ledgerListAPI';
import { createAccount, getAccountInfo, POST_NICKNAME } from '../api/userAPI';
import { RootState } from '../store';

export interface UserDataState {
  userId: string;
  userName: string | null;
  userNickName: string | null;
  userEmail: string | null;
  userPortraitUrl: string | null;
  cityList: string[];
  friends: {
    userId: string;
    name: string;
    friendStatus: 'inviting' | 'beenInvited' | 'friend';
    coopStatus: 'none' | 'inviting' | 'beenInvited' | 'coorperated';
    coopCityId: string | null;
  }[];
  subLabels: { [key: string]: string[] };
  trophy: { list: number[]; citizens: number[] };
  gameSetting: {
    hasMusic: boolean;
    hasHints: boolean;
    isRecordContinue: boolean;
  };
}

export interface UserInfoState {
  status: 'idle' | 'loading' | 'failed';
  loginStatus: {
    isLogin: boolean;
    isAuthing: boolean;
    isLoading: boolean;
  };
  editStatus: {
    isNickNameEdit: boolean;
    inputText: string;
  };
  data: UserDataState;
}

const initialState: UserInfoState = {
  status: 'idle',
  loginStatus: {
    isLogin: false,
    isAuthing: true,
    isLoading: false,
  },
  editStatus: {
    isNickNameEdit: false,
    inputText: '',
  },
  data: {
    userId: '',
    userName: null,
    userNickName: '',
    userEmail: null,
    userPortraitUrl: null,
    cityList: [],
    friends: [],
    subLabels: { food: [''] },
    trophy: { list: [], citizens: [] },
    gameSetting: { hasMusic: false, hasHints: false, isRecordContinue: false },
  },
};

export const CREATE_ACCOUNT = createAsyncThunk(
  'userInfo/CREATE_ACCOUNT',
  async (userInfo: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }) => {
    const { uid, displayName, email, photoURL } = userInfo;
    const userName = displayName || '';
    const userEmail = email || '';
    const userPortraitUrl = photoURL || '';
    const user = { userId: uid, userName, userEmail, userPortraitUrl };
    const response = await createAccount(user);

    return { user, data: response.data };
  }
);

export const GET_ACCOUNT_INFO = createAsyncThunk(
  'userInfo/GET_ACCOUNT_INFO',
  async (userInfo: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }) => {
    const { uid, displayName, email, photoURL } = userInfo;
    const userName = displayName || '';
    const userEmail = email || '';
    const userPortraitUrl = photoURL || '';
    const user = { userId: uid, userName, userEmail, userPortraitUrl };
    const response = await getAccountInfo(user);
    if (response) return response.data;
  }
);

export const SAVE_NICKNAME = createAsyncThunk(
  'userInfo/SAVE_NICKNAME',
  async (userNickName: string, { getState }) => {
    const allStates = getState() as RootState;
    const { userId } = allStates.userInfo.data;
    await POST_NICKNAME(userId, userNickName);
    return userNickName;
  }
);

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
      state.data.userId = uid;
      state.data.userName = displayName;
      state.data.userPortraitUrl = photoURL;
      state.data.userEmail = email;
      state.loginStatus.isLogin = true;
    },
    LOG_OUT: (state) => {
      console.log('log out');
      state.data = initialState.data;
      state.loginStatus = initialState.loginStatus;
    },
    EDIT_NICKNAME_ACTIVATE: (state, action: PayloadAction<string>) => {
      state.editStatus.isNickNameEdit = true;
      state.editStatus.inputText = action.payload;
    },
    TYPING_NICKNAME: (state, action: PayloadAction<string>) => {
      state.editStatus.inputText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CREATE_ACCOUNT.pending, (state) => {
        state.status = 'loading';
        //要跳出提示「帳號創建中」
      })
      .addCase(CREATE_ACCOUNT.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loginStatus.isLogin = true;
        const { cityId, ledgerBookId } = action.payload.data;
        state.data.userId = action.payload.user.userId;
        state.data.userName = action.payload.user.userName;
        state.data.userPortraitUrl = action.payload.user.userPortraitUrl;
        state.data.userEmail = action.payload.user.userEmail;
        console.log('check', cityId, ledgerBookId);
        state.data.cityList = [cityId];
      })
      .addCase(CREATE_ACCOUNT.rejected, (state) => {
        state.status = 'failed';
        alert('create account rejected');
      })
      .addCase(GET_ACCOUNT_INFO.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(GET_ACCOUNT_INFO.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loginStatus.isLogin = true;
        if (action.payload) {
          // const cityId = action.payload.cityList[0];
          // state.data.cityList = [cityId];
          state.data = action.payload;
        }
      })
      .addCase(GET_ACCOUNT_INFO.rejected, (state) => {
        state.status = 'failed';
        alert('get account info rejected');
      })
      .addCase(SAVE_NICKNAME.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(SAVE_NICKNAME.fulfilled, (state, action) => {
        state.status = 'idle';
        state.editStatus.isNickNameEdit = false;
        state.data.userNickName = action.payload;
        console.log('nickname updated');
      })
      .addCase(SAVE_NICKNAME.rejected, (state) => {
        state.status = 'failed';
        alert('get account info rejected');
      });
  },
});

export const {
  AUTHING_TOGGLE,
  LOGGED_IN,
  LOG_OUT,
  EDIT_NICKNAME_ACTIVATE,
  TYPING_NICKNAME,
} = userInfo.actions;

export default userInfo.reducer;
