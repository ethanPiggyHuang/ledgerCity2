import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  doc,
  arrayUnion,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { LedgerDataState } from '../reducers/ledgerSingleSlice';

export async function postLedger(
  ledgerData: LedgerDataState,
  availableGrids: { yIndex: number; xIndex: number }[]
) {
  const ledgerRef = await addDoc(
    collection(db, 'ledgerBooks', 'UcrgCxiJxo3oA7vvwYtd', 'ledgers'),
    { ...ledgerData, recordTime: serverTimestamp() }
  );

  const housesRef = doc(db, 'cities', 'YFbhq5M8vFBIUMMWZhqo');
  const newPosition =
    availableGrids[Math.floor(Math.random() * availableGrids.length)]; //TODO: 可以調整選位子邏輯
  await updateDoc(housesRef, {
    houses: arrayUnion({
      ledgerId: ledgerRef.id,
      height: 1,
      position: newPosition,
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
