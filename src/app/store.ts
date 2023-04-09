import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import cityInfoReducer from '../features/gameMap/gameMapSlice';
import cityArrangementReducer from '../features/gameMap/citySlice';
import ledgerSingleReducer from '../features/ledger/ledgerSlice';
import ledgerListReducer from '../features/statistics/statisticsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cityInfo: cityInfoReducer,
    cityArrangement: cityArrangementReducer,
    ledgerSingle: ledgerSingleReducer,
    ledgerList: ledgerListReducer,
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
