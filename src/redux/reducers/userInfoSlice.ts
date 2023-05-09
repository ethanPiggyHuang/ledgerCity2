import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FriendInfoState } from '../reducers/usersActivitySlice';
import {
  createAccount,
  getAccountInfo,
  POST_NICKNAME,
  FIND_ACCOUNT_MATCH,
  NEW_FRIEND_REQUEST,
  updateCityList,
  getOtherCityInfo,
  createNewCity,
  agreeCooperation,
  disagreeCooperation,
} from '../api/userAPI';
import { RootState } from '../store';

export interface UserDataState {
  userId: string;
  userName: string;
  userNickName: string;
  userEmail: string;
  userPortraitUrl: string;
  cityList: string[];
  subLabels: { [key: string]: string[] };
  trophy: { list: number[]; citizens: number[] };
  gameSetting: {
    hasMusic: boolean;
    hasHints: boolean;
    isRecordContinue: boolean;
  };
}

export interface FriendStatusState {
  userId: string;
  name: string;
  coopStatus:
    | 'inviting'
    | 'beenInvited'
    | 'disagree'
    | 'beenRejected'
    | 'coorperated';
  coopCityId: string | null;
}

export interface UserInfoState {
  status: 'idle' | 'loading' | 'failed';
  loginStatus: {
    isLogin: boolean;
    isAuthing: boolean;
    isLoading: boolean;
  };
  friends: FriendStatusState[];
  editStatus: {
    isNickNameEdit: boolean;
    inputText: string;
    emailInput: string;
    queryResult: FriendInfoState[];
  };
  data: UserDataState;
  additionalData: {
    cityNames: { [key: string]: string };
    cityAccessUsers: { [key: string]: string[] };
    chosenCoopCityIndex: number;
  };
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
    emailInput: '',
    queryResult: [],
  },
  friends: [],
  data: {
    userId: '',
    userName: '',
    userNickName: '',
    userEmail: '',
    userPortraitUrl: '',
    cityList: [],
    subLabels: { food: [''] },
    trophy: { list: [], citizens: [] },
    gameSetting: { hasMusic: false, hasHints: false, isRecordContinue: false },
  },
  additionalData: {
    cityNames: {},
    cityAccessUsers: {},
    chosenCoopCityIndex: 0,
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

export const CREATE_NEW_CITY = createAsyncThunk(
  'userInfo/CREATE_NEW_CITY',
  async (userId: string) => {
    const response = await createNewCity(userId);

    return response.cityId;
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
    if (response) return response;
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

export const QUEST_FRIEND = createAsyncThunk(
  'userInfo/QUEST_FRIEND',
  async (friendEmail: string, { getState }) => {
    const fullEmail = `${friendEmail}@gmail.com`;
    const response = await FIND_ACCOUNT_MATCH(fullEmail);
    return response.result;
  }
);

export const FRIEND_REQUEST = createAsyncThunk(
  'userInfo/FRIEND_REQUEST',
  async (payload: { friendId: string; cityId: string }, { getState }) => {
    const { cityId, friendId } = payload;
    const allStates = getState() as RootState;
    const { userId } = allStates.userInfo.data;
    try {
      await NEW_FRIEND_REQUEST(userId, friendId, cityId);
    } catch (error) {
      console.log(error);
    }
  }
);

export const CITY_REDIRECTION = createAsyncThunk(
  'userInfo/CITY_REDIRECTION',
  async (payload: { userId: string; cityId: string }, { getState }) => {
    const { userId, cityId } = payload;
    const allStates = getState() as RootState;
    const cityList = allStates.userInfo.data.cityList;
    //TODO!!!!  要避免亂入別人城市
    const newCityList = [cityId, ...cityList.filter((city) => city !== cityId)];
    await updateCityList(userId, newCityList);
    return newCityList;
  }
);

export const GET_CITY_NAME = createAsyncThunk(
  'userInfo/GET_CITY_NAME',
  async (cityId: string) => {
    const response = await getOtherCityInfo(cityId);
    if (response) {
      return {
        cityId,
        cityName: response.cityName,
        accessUsers: response.accessUsers,
      };
    }
  }
);

export const AGREE_COOPERATION = createAsyncThunk(
  'userInfo/AGREE_COOPERATION',
  async (
    payload: { userId: string; friendId: string; cityId: string },
    { getState }
  ) => {
    const allStates = getState() as RootState;
    const cityList = allStates.userInfo.data.cityList;
    const { userId, friendId, cityId } = payload;
    const newCityList = [cityId, ...cityList];
    await agreeCooperation(userId, friendId, cityId, newCityList);
    return newCityList;
  }
);

export const DISAGREE_COOPERATION = createAsyncThunk(
  'userInfo/DISAGREE_COOPERATION',
  async (payload: { userId: string; friendId: string }) => {
    const { userId, friendId } = payload;
    await disagreeCooperation(userId, friendId);
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
      state.data.userName = displayName || '';
      state.data.userPortraitUrl = photoURL || '';
      state.data.userEmail = email || '';
      state.loginStatus.isLogin = true;
    },
    LOG_OUT: (state) => {
      console.log('log out');
      state.data = initialState.data;
      state.loginStatus = initialState.loginStatus;
      state.friends = initialState.friends;
      state.additionalData = initialState.additionalData;
      state.editStatus = initialState.editStatus;
    },
    EDIT_NICKNAME_SWITCH: (state, action: PayloadAction<boolean>) => {
      state.editStatus.isNickNameEdit = action.payload;
    },
    TYPING_NICKNAME: (state, action: PayloadAction<string>) => {
      state.editStatus.inputText = action.payload;
    },
    TYPING_FRIEND_EMAIL: (state, action: PayloadAction<string>) => {
      state.editStatus.emailInput = action.payload;
    },
    UPDATE_INSTANT_FRIENDS_STATUS: (
      state,
      action: PayloadAction<FriendStatusState[]>
    ) => {
      state.friends = action.payload;
    },
    SWITCH_COOP_CITY_OPTION: (state) => {
      const cityOptionAmount = state.data.cityList.length;
      const pastOption = state.additionalData.chosenCoopCityIndex;
      state.additionalData.chosenCoopCityIndex =
        (pastOption + 1) % cityOptionAmount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CREATE_ACCOUNT.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(CREATE_ACCOUNT.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loginStatus.isLogin = true;
        const { cityId, userNickName } = action.payload.data;
        const { userId, userName, userPortraitUrl, userEmail } =
          action.payload.user;
        state.data.userId = userId;
        state.data.userName = userName;
        state.data.userNickName = userNickName === '' ? userName : userNickName;
        state.data.userPortraitUrl = userPortraitUrl;
        state.data.userEmail = userEmail;
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
          state.data = action.payload.data;
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
      })
      .addCase(QUEST_FRIEND.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(QUEST_FRIEND.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload.length === 0) alert('無此帳號，請再次確認');
        state.editStatus.queryResult = action.payload;
      })
      .addCase(QUEST_FRIEND.rejected, (state) => {
        state.status = 'failed';
        alert('searching friend rejected');
      })
      .addCase(FRIEND_REQUEST.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(FRIEND_REQUEST.fulfilled, (state, action) => {
        state.status = 'idle';
        alert('request sent');
      })
      .addCase(FRIEND_REQUEST.rejected, (state) => {
        state.status = 'failed';
        alert('friend request rejected');
      })
      .addCase(CITY_REDIRECTION.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(CITY_REDIRECTION.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data.cityList = action.payload;
      })
      .addCase(CITY_REDIRECTION.rejected, (state) => {
        state.status = 'failed';
        alert('friend request rejected');
      })
      .addCase(GET_CITY_NAME.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(GET_CITY_NAME.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload) {
          const { cityId, cityName, accessUsers } = action.payload;
          if (cityId && cityName) {
            state.additionalData.cityNames[cityId] = cityName;
            state.additionalData.cityAccessUsers[cityId] = accessUsers;
          }
        }
      })
      .addCase(GET_CITY_NAME.rejected, (state) => {
        state.status = 'failed';
        alert('get city name rejected');
      })
      .addCase(CREATE_NEW_CITY.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(CREATE_NEW_CITY.fulfilled, (state, action) => {
        state.status = 'idle';
        alert('new city');
        state.data.cityList = [action.payload, ...state.data.cityList];
      })
      .addCase(CREATE_NEW_CITY.rejected, (state) => {
        state.status = 'failed';
        alert('add new city rejected');
      })
      .addCase(AGREE_COOPERATION.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(AGREE_COOPERATION.fulfilled, (state, action) => {
        state.status = 'idle';
        alert('agreement succeed, redirect');
        state.data.cityList = action.payload;
      })
      .addCase(AGREE_COOPERATION.rejected, (state) => {
        state.status = 'failed';
        alert('agree cooperaton failed');
      });
  },
});

export const {
  AUTHING_TOGGLE,
  LOGGED_IN,
  LOG_OUT,
  EDIT_NICKNAME_SWITCH,
  TYPING_NICKNAME,
  TYPING_FRIEND_EMAIL,
  UPDATE_INSTANT_FRIENDS_STATUS,
  SWITCH_COOP_CITY_OPTION,
} = userInfo.actions;

export default userInfo.reducer;
