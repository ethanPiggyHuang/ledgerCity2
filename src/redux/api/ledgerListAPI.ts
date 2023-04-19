import { db } from '../../config/firebase';
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
} from 'firebase/firestore';
import { WhereFilterOp } from '@firebase/firestore-types';

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

export async function deleteLedger(ledgerBookId: string, ledgerId: string) {
  await deleteDoc(doc(db, 'ledgerBooks', ledgerBookId, 'ledgers', ledgerId));
}
