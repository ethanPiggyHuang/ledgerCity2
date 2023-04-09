import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

export interface LedgerListStatus {
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

export async function fetchLedgerList(ledgerBookId: string) {
  const ledgersRef = collection(db, 'ledgerBooks', ledgerBookId, 'ledgers');
  const q = query(ledgersRef, where('timeMonth', '==', 4));

  const querySnapshot = await getDocs(q);
  let result: any[] = []; //TODO typescript
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });

  return new Promise<{ data: LedgerListStatus[] }>((resolve) =>
    resolve({ data: result as LedgerListStatus[] })
  );
}
