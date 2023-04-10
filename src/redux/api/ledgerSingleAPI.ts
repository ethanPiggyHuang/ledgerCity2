import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  doc,
  arrayUnion,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

export interface LedgerDataStatus {
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
}

export async function postLedger(
  ledgerData: LedgerDataStatus,
  availableGrids: { yIndex: number; xIndex: number }[]
) {
  const ledgerRef = await addDoc(
    collection(db, 'ledgerBooks', 'UcrgCxiJxo3oA7vvwYtd', 'ledgers'),
    { ...ledgerData, recordTime: serverTimestamp() }
  );
  // console.log('id', ledgerRef.id);

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
  // console.log('updated', newPosition.xIndex, newPosition.yIndex);
}
