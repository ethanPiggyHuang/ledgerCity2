import { db } from '../../config/firebase';
import {
  setDoc,
  getDoc,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { rtdb } from '../../config/firebase';
import { ref, set } from 'firebase/database';
import { UserDataState } from '../reducers/userInfoSlice';

export async function createAccount(userInfo: {
  userId: string;
  userName: string;
  userEmail: string;
  userPortraitUrl: string;
}) {
  const { userId } = userInfo;
  const initialUserProfile = {
    userNickName: '',
    cityList: [],
    friends: [],
    subLabels: { food: ['早餐', '午餐', '晚餐'] },
    trophy: { list: [], citizens: [] },
    gameSetting: { hasMusic: false, hasHints: false, isRecordContinue: false },
  };
  const initailCityData = {
    accessUsers: [userId],
    citizen: [],
    cityName: '記帳城市',
    houses: [
      {
        height: 1,
        ledgerId: '0',
        position: { xIndex: 1, yIndex: 1 },
        type: '市政廳',
      },
    ],
  };
  await setDoc(doc(db, 'users', userId), {
    ...userInfo,
    ...initialUserProfile,
  });
  await setDoc(doc(db, 'allUserStatus', userId), {
    currentPage: 'city',
    isEditingCity: false,
    fadeOutTime: serverTimestamp(),
    latestActiveTime: serverTimestamp(),
  });
  const cityRef = await addDoc(collection(db, 'cities'), initailCityData);
  const ledgerBookRef = await addDoc(collection(db, 'ledgerBooks'), {
    cityId: cityRef.id,
  });
  await updateDoc(doc(db, 'cities', cityRef.id), {
    ledgerBookId: ledgerBookRef.id,
  });
  await updateDoc(doc(db, 'users', userId), {
    cityList: arrayUnion(cityRef.id),
  });

  return new Promise<{ data: { cityId: string; ledgerBookId: string } }>(
    (resolve) =>
      resolve({ data: { cityId: cityRef.id, ledgerBookId: ledgerBookRef.id } })
  );
}

export async function getAccountInfo(userInfo: {
  userId: string;
  userName: string;
  userEmail: string;
  userPortraitUrl: string;
}) {
  const { userId, userName, userEmail, userPortraitUrl } = userInfo;

  await updateDoc(doc(db, 'users', userId), {
    userName,
    userEmail,
    userPortraitUrl,
  });
  const docSnap = await getDoc(doc(db, 'users', userId));
  if (docSnap.exists()) {
    const data = docSnap.data() as UserDataState; //TODO typescript
    return new Promise<{ data: UserDataState }>((resolve) => resolve({ data }));
  }
  // const cityRef = await addDoc(collection(db, 'cities'), initailCityData);
  // const ledgerBookRef = await addDoc(collection(db, 'ledgerBooks'), {
  //   cityId: cityRef.id,
  // });
  // await updateDoc(doc(db, 'cities', cityRef.id), {
  //   ledgerBookId: ledgerBookRef.id,
  // });
  // await updateDoc(doc(db, 'users', userId), {
  //   cityList: arrayUnion(cityRef.id),
  // });

  // return new Promise<{ data: { cityId: string; ledgerBookId: string } }>(
  //   (resolve) =>
  //     resolve({ data: { cityId: cityRef.id, ledgerBookId: ledgerBookRef.id } })
  // );
}

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
  // console.log('userId', userId);
  await updateDoc(doc(db, 'allUserStatus', userId), {
    currentPage: location,
    latestActiveTime: serverTimestamp(),
  });
}

export async function POST_NICKNAME(userId: string, userNickName: string) {
  await updateDoc(doc(db, 'users', userId), { userNickName: userNickName });
}
