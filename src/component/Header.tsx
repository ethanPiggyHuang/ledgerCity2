import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  UPDATE_CITY_INFO,
  CityBasicInfoState,
  CHANGE_CITY_NAME,
  UPDATE_CITY_NAME,
} from '../redux/reducers/cityBasicInfoSlice';
import { RENAME_CITY } from '../redux/reducers/cityArrangementSlice';
import { UPDATE_LEDGER_LIST } from '../redux/reducers/ledgerListSlice';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { doc } from 'firebase/firestore';
import { LedgerDataState } from '../redux/reducers/ledgerSingleSlice';
import { useNavigate } from 'react-router-dom';
import { Banner } from '../component/Banner';
import {
  UPDATE_INSTANT_FRIENDS_STATUS,
  FriendStatusState,
} from '../redux/reducers/userInfoSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

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
  const { ledgerBookId, cityName, accessUsers } = useAppSelector(
    (state) => state.cityBasicInfo
  );
  const { isRenaming } = useAppSelector((state) => state.cityArrangement);
  const { userId, cityList } = useAppSelector((state) => state.userInfo.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (cityList.length !== 0) {
      const q = doc(db, 'cities', cityList[0]);
      const unsubscribe = onSnapshot(q, (doc) => {
        const cityInfo = doc.data();
        dispatch(UPDATE_CITY_INFO(cityInfo as CityBasicInfoState));
      });
      navigate('/city');
      return () => unsubscribe();
    }
  }, [cityList]);

  useEffect(() => {
    if (ledgerBookId.length !== 0) {
      if (accessUsers.findIndex((id) => id === userId) === -1) {
        return;
        //TODO: 非accessUsers
      } else {
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
    }
  }, [ledgerBookId]);

  useEffect(() => {
    if (userId) {
      const unsub = onSnapshot(
        collection(db, 'users', userId, 'friends'),
        (querySnapshot) => {
          const friends: FriendStatusState[] = [];
          querySnapshot.forEach((doc) =>
            friends.push(doc.data() as FriendStatusState)
          );
          if (friends.length !== 0) {
            dispatch(UPDATE_INSTANT_FRIENDS_STATUS(friends));
          }
        }
      );
      return () => unsub();
    }
  }, [userId]);

  return (
    <Wrapper>
      {userId ? (
        <>
          <Banner />
          <TextWrapper>
            <BannerText
              $isRenaming={isRenaming}
              value={`${cityName}`}
              onClick={() => dispatch(RENAME_CITY(true))}
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                dispatch(CHANGE_CITY_NAME(target.value));
              }}
              onKeyDown={(event) => {
                if (event.code === 'Enter') {
                  event.preventDefault();
                }
              }}
              onBlur={() => setTimeout(() => dispatch(RENAME_CITY(false)), 100)}
            ></BannerText>
            <SaveIcon
              $isRenaming={isRenaming}
              icon={faFloppyDisk}
              onClick={() => {
                dispatch(UPDATE_CITY_NAME({ cityId: cityList[0], cityName }));
                // dispatch(RENAME_CITY(false));
              }}
            />
          </TextWrapper>
        </>
      ) : (
        ''
      )}
    </Wrapper>
  );
};

export default Header;

type BannerTextProps = {
  $isRenaming: boolean;
};
type SaveIconProps = {
  $isRenaming: boolean;
};

const Wrapper = styled.div`
  position: fixed;
  transform: translate(50%);
  z-index: 3;
  top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  /* border: 1px solid black; */
  position: absolute;
  height: 65%;
  width: 70%;
  display: flex;
  align-items: bottom;
`;

const BannerText = styled.input<BannerTextProps>`
  /* position: absolute; */
  color: #ae7a00;
  font-size: 42px;
  /* height: 65%; */
  /* padding: 20px; */
  text-align: center;
  letter-spacing: 0.4em;
  font-weight: bold;
  border: none;
  border-bottom: ${({ $isRenaming }) =>
    $isRenaming ? '2px solid #df9469' : 'none'};

  background-color: rgba(0, 0, 0, 0);
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  width: 100%;

  &:focus {
    border-bottom: 2px solid #df9469;
  }
  &:hover {
    border-bottom: 2px solid #df9469;
  }
  &:focus:hover {
    border-bottom: 2px solid #df9469;
  }
`;

const SaveIcon = styled(FontAwesomeIcon)<SaveIconProps>`
  display: ${({ $isRenaming }) => ($isRenaming ? 'block' : 'none')};
  font-size: 20px;
  z-index: 9;
  position: absolute;
  bottom: 5px;
  right: -5px;
  color: #df9469;
  cursor: pointer;
`;

const LandingBannerWrapper = styled.div`
  transform: translateX(-50%) scale(0.6);
`;
