import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Banner } from '../component/Banner';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  CityBasicInfoState,
  GET_CITY_INFO,
  RENAME_CITY,
  TYPE_CITY_NAME,
  UPDATE_CITY_NAME,
} from '../redux/reducers/citySlice';
import { UPDATE_LEDGER_LIST } from '../redux/reducers/ledgerListSlice';
import { LedgerDataState } from '../redux/reducers/ledgerSingleSlice';
import {
  FriendStatusState,
  TOGGLE_AUTHING,
  UPDATE_INSTANT_FRIENDS_STATUS,
} from '../redux/reducers/userInfoSlice';
import { db } from '../utils/firebase';

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
    (state) => state.city.basicInfo
  );
  const { isRenaming, isTouring } = useAppSelector((state) => state.city);
  const { userId, cityList } = useAppSelector((state) => state.userInfo.data);

  // async await

  useEffect(() => {
    if (ledgerBookId.length !== 0) {
      if (accessUsers.findIndex((id) => id === userId) === -1) {
        // visitor
        return;
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
          let friends: FriendStatusState[] = [];
          querySnapshot.forEach((doc) => {
            friends.push(doc.data() as FriendStatusState);
          });
          if (friends.length !== 0) {
            dispatch(UPDATE_INSTANT_FRIENDS_STATUS(friends));
          }
        },
        (error) => {
          console.log('error', error);
        }
      );
      return () => unsub();
    }
  }, [userId]);

  return (
    <Wrapper $isFolded={isTouring}>
      {userId && (
        <>
          <Banner />
          <TextWrapper>
            <BannerText
              type="text"
              $isRenaming={isRenaming}
              value={`${cityName}`}
              onClick={() => dispatch(RENAME_CITY(true))}
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                dispatch(TYPE_CITY_NAME(target.value));
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
              }}
            />
          </TextWrapper>
        </>
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
type WrapperProps = {
  $isFolded: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  position: fixed;
  transform: translateX(50%);
  z-index: 3;
  top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 1s ease;
  transform: ${({ $isFolded }) =>
    $isFolded ? 'translateY(-180%) translateX(50%)' : 'translateX(50%)'};
`;

const TextWrapper = styled.div`
  position: absolute;
  height: 65%;
  width: 70%;
  display: flex;
  align-items: bottom;
`;

const BannerText = styled.input<BannerTextProps>`
  color: #ae7a00;
  font-size: 42px;
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
