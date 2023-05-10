import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import cityReducer from './reducers/citySlice';
import landingIntroReducer from './reducers/landingIntroSlice';
import ledgerListReducer from './reducers/ledgerListSlice';
import ledgerSingleReducer from './reducers/ledgerSingleSlice';
import pageControlReducer from './reducers/pageControlSlice';
import userInfoReducer from './reducers/userInfoSlice';
import userActivityReducer from './reducers/usersActivitySlice';

export const store = configureStore({
  reducer: {
    city: cityReducer,
    ledgerSingle: ledgerSingleReducer,
    ledgerList: ledgerListReducer,
    userInfo: userInfoReducer,
    userActivity: userActivityReducer,
    pageControl: pageControlReducer,
    landingIntro: landingIntroReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
