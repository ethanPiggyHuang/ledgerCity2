import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { HouseState } from '../../utils/interface';

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
