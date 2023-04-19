import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  UPDATE_CITY_INFO,
  CityBasicInfoState,
} from '../redux/reducers/cityBasicInfoSlice';
import {
  getLedgerList,
  UPDATE_LEDGER_LIST,
} from '../redux/reducers/ledgerListSlice';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LedgerDataState } from '../redux/reducers/ledgerSingleSlice';

interface LedgerDatabaseState {
  timeLedger: number;
  timeMonth: number;
  timeYear: number;
  item: string;
  labelMain: string;
  labelSubs: string[];
  payWho: string;
  payHow: 'cash' | 'creditCard' | 'mobile';
  amount: { currency: string; number: number; numberNT: number }; //TODO: currency exchange
  recordTime: { seconds: number; nanoseconds: number };
  recordWho: string;
}

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { ledgerBookId } = useAppSelector((state) => state.cityBasicInfo);
  const { cityList } = useAppSelector((state) => state.userInfo.data);

  const auth = getAuth();

  useEffect(() => {
    if (cityList.length !== 0) {
      const q = doc(db, 'cities', cityList[0]);
      const unsubscribe = onSnapshot(q, (doc) => {
        const cityInfo = doc.data();
        dispatch(UPDATE_CITY_INFO(cityInfo as CityBasicInfoState));
      });
      return () => unsubscribe();
    }
  }, [cityList]);

  useEffect(() => {
    if (ledgerBookId.length !== 0) {
      const q = query(
        collection(db, 'ledgerBooks', ledgerBookId, 'ledgers'),
        orderBy('timeLedger')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let rawResult = [] as any;
        querySnapshot.forEach((doc) => {
          rawResult.push({ ledgerId: doc.id, data: doc.data() });
        });

        const convertedResult: { ledgerId: string; data: LedgerDataState }[] =
          rawResult.map(
            (
              data: { ledgerId: string; data: LedgerDatabaseState },
              index: number
            ) => {
              if (index === 0) console.log('record', data.data.recordTime);
              const recordTime = data.data.recordTime
                ? new Date(data.data.recordTime.seconds * 1000).getTime()
                : 0;
              return {
                ...data,
                data: { ...data.data, recordTime },
              };
            }
          );
        dispatch(UPDATE_LEDGER_LIST(convertedResult));
      });

      return () => unsubscribe();
    }
  }, [ledgerBookId]);

  return <Wrapper>Header</Wrapper>;
};

export default Header;

const Wrapper = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  font-size: 40px;
`;
