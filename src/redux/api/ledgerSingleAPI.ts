import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  doc,
  arrayUnion,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { LedgerInputState } from '../reducers/ledgerSingleSlice';

export interface LedgerDataState {
  input: LedgerInputState;
  recordWho: string;
}

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
      type: ledgerData.input.labelMain,
    }),
  });
}

export async function editLedger(
  ledgerBookId: string,
  ledgerId: string,
  ledgerData: LedgerDataState
) {
  const ledgerRef = doc(db, 'ledgerBooks', ledgerBookId, 'ledgers', ledgerId);
  await updateDoc(ledgerRef, { ...ledgerData, recordTime: serverTimestamp() });
}
