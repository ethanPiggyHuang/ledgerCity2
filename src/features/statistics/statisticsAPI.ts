import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { LedgerListState } from './statisticsSlice';

export async function fetchLedgerList(ledgerBookId: string) {
  const ledgersRef = collection(db, 'ledgerBooks', ledgerBookId, 'ledgers');
  const q = query(ledgersRef, where('payHow', '==', 'mobile'));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
  });

  // const cityRef = doc(db, 'ledgerBooks', ledgerBookId);
  // const docSnapshot = await getDoc(cityRef);
  // return new Promise<{ data: LedgerListState }>((resolve) =>
  //   resolve({ data: docSnapshot.data() as LedgerListState })
  // ); //TODO what if failed?
}
