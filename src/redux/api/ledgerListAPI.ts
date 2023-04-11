import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { WhereFilterOp } from '@firebase/firestore-types';

export interface LedgerListState {
  ledgerId: string;
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
  imageUrl: string;
  recordWho: string;
  recordTime: any; //TODO typescript
}

export async function fetchLedgerList(
  ledgerBookId: string,
  queryParams: {
    field: string;
    whereFilterOp: WhereFilterOp;
    value: string | number;
  }
) {
  const ledgersRef = collection(db, 'ledgerBooks', ledgerBookId, 'ledgers');
  const { field, whereFilterOp, value } = queryParams;
  const q = query(ledgersRef, where(field, whereFilterOp, value));

  const querySnapshot = await getDocs(q);
  let result: any[] = []; //TODO typescript
  querySnapshot.forEach((doc) => {
    result.push({ ledgerId: doc.id, ...doc.data() });
  });

  return new Promise<{ data: LedgerListState[] }>((resolve) =>
    resolve({ data: result as LedgerListState[] })
  );
}
