import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { LedgerDataState } from '../reducers/ledgerSingleSlice';

export async function createLedger(
  cityId: string,
  ledgerBookId: string,
  ledgerData: LedgerDataState,
  nextHousePosition: { yIndex: number; xIndex: number }
) {
  const ledgerRef = await addDoc(
    collection(db, 'ledgerBooks', ledgerBookId, 'ledgers'),
    { ...ledgerData, recordTime: serverTimestamp() }
  );

  const housesRef = doc(db, 'cities', cityId);
  await updateDoc(housesRef, {
    houses: arrayUnion({
      ledgerId: ledgerRef.id,
      height: 1,
      position: nextHousePosition,
      type: ledgerData.labelMain,
    }),
  });
}

export async function updateLedger(
  ledgerBookId: string,
  ledgerId: string,
  updateData: LedgerDataState
) {
  const ledgerRef = doc(db, 'ledgerBooks', ledgerBookId, 'ledgers', ledgerId);
  await updateDoc(ledgerRef, { ...updateData, recordTime: serverTimestamp() });
}
