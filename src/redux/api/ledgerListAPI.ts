import { db } from '../../utils/firebase';
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  orderBy,
  deleteDoc,
  updateDoc,
  deleteField,
  arrayRemove,
} from 'firebase/firestore';
import { WhereFilterOp } from '@firebase/firestore-types';
import { HouseState } from '../reducers/cityBasicInfoSlice';

export interface LedgerRecordedState {
  ledgerId: string;
  data: {
    timeLedger: number;
    timeYear: number;
    timeMonth: number;
    item: string;
    labelMain: string;
    labelSubs: string[];
    payWho: string;
    payHow: 'cash' | 'creditCard' | 'mobile';
    amount: {
      currency: string;
      number: number;
      numberNT: number;
    };
    recordWho: string;
    recordTime: any; //TODO typescript
  };
}

export async function fetchLedgerList(
  ledgerBookId: string,
  queryParams: {
    // TODO: delete sometime
    field: string;
    whereFilterOp: WhereFilterOp;
    value: string | number;
  }
) {
  const ledgersRef = collection(db, 'ledgerBooks', ledgerBookId, 'ledgers');
  // const { field, whereFilterOp, value } = queryParams;
  // const q = query(ledgersRef, where(field, whereFilterOp, value));
  const q = query(ledgersRef, orderBy('timeLedger'));

  const querySnapshot = await getDocs(q);
  let result: any[] = []; //TODO typescript
  querySnapshot.forEach((doc) => {
    result.push({ ledgerId: doc.id, data: doc.data() });
  });

  return new Promise<{ dataList: LedgerRecordedState[] }>((resolve) =>
    resolve({ dataList: result as LedgerRecordedState[] })
  );
}

export async function deleteLedger(
  cityId: string,
  newHouses: HouseState[],
  ledgerBookId: string,
  ledgerId: string
) {
  const cityRef = doc(db, 'cities', cityId);
  const ledgerRef = doc(db, 'ledgerBooks', ledgerBookId, 'ledgers', ledgerId);
  await deleteDoc(ledgerRef);
  await updateDoc(cityRef, { houses: newHouses });
}
