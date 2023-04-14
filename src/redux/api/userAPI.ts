import { db } from '../../config/firebase';
import {
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
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

export async function FETCH_COORPERATE_LOCATION(userId: string) {
  console.log('userId', userId);
  const docSnap = await getDoc(doc(db, 'allUserStatus', userId));
  if (docSnap) {
    console.log(new Date(docSnap.data()?.fadeOutTime.seconds * 1000));
  }
}

export async function updateLocation(userId: string, location: string) {
  console.log('userId', userId);
  await updateDoc(doc(db, 'allUserStatus', userId), {
    currentPage: location,
    latestActiveTime: serverTimestamp(),
  });
}
