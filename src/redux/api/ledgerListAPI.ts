import { WhereFilterOp } from '@firebase/firestore-types';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { HouseState } from '../../utils/interface';

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
    recordTime: any;
  };
}

export async function getLedgerList(
  ledgerBookId: string,
  queryParams: {
    field: string;
    whereFilterOp: WhereFilterOp;
    value: string | number;
  }
) {
  const ledgersRef = collection(db, 'ledgerBooks', ledgerBookId, 'ledgers');
  const q = query(ledgersRef, orderBy('timeLedger'));

  const querySnapshot = await getDocs(q);
  let result: any[] = [];
  querySnapshot.forEach((doc) => {
    result.push({ ledgerId: doc.id, data: doc.data() });
  });

  return new Promise<{ dataList: LedgerRecordedState[] }>((resolve) =>
    resolve({ dataList: result as LedgerRecordedState[] })
  );
}

export async function deleteSingleLedger(
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
