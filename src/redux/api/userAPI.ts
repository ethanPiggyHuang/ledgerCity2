import { db } from '../../config/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { rtdb } from '../../config/firebase';
import { ref, set } from 'firebase/database';

export async function postFadeOutTime(userId: string) {
  // await setDoc(doc(db, 'allUserStatus', userId), {
  //   fadeOutTime: serverTimestamp(),
  // });
  console.log('最後要打開此function: postFadeOutTime()');
}

export async function postFadeOutTimeRT(userId: string, enableType: string) {
  // const logoutTime = new Date();
  // set(ref(rtdb, `users/${userId}/logout`), {
  //   logoutTime: logoutTime,
  //   enableType: enableType,
  // });
  console.log('最後要打開此function: postFadeOutTimeRT()');
}
