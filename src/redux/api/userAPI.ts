import { ref, set } from 'firebase/database';
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, rtdb } from '../../utils/firebase';
import { FriendInfoState, UserDataState } from '../reducers/userInfoSlice';

export async function createAccount(userInfo: {
  userId: string;
  userName: string;
  userEmail: string;
  userPortraitUrl: string;
}) {
  const { userId, userName } = userInfo;
  const initialUserProfile = {
    userNickName: userName,
    cityList: [],
    friends: [],
    subLabels: {},
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

  const userDocRef = doc(db, 'users', userId);

  const docSnap = await getDoc(userDocRef);
  let cityId: string;
  let ledgerBookId: string;
  let userNickName = '';
  if (docSnap.exists()) {
    userNickName = docSnap.data()?.userNickName || '';
    cityId = docSnap.data().cityList[0];
    const cityDocSnap = await getDoc(doc(db, 'cities', cityId));
    ledgerBookId = cityDocSnap.data()?.ledgerBookId;
  } else {
    await setDoc(userDocRef, {
      ...userInfo,
      ...initialUserProfile,
    });
    await setDoc(doc(db, 'allUserStatus', userId), {
      currentActivity: 'city',
      fadeOutTime: serverTimestamp(),
      latestActiveTime: serverTimestamp(),
    });
    const cityRef = await addDoc(collection(db, 'cities'), initailCityData);
    cityId = cityRef.id;
    const ledgerBookRef = await addDoc(collection(db, 'ledgerBooks'), {
      cityId,
    });
    ledgerBookId = ledgerBookRef.id;
    await updateDoc(doc(db, 'cities', cityRef.id), {
      ledgerBookId,
    });
    await updateDoc(doc(db, 'users', userId), {
      cityList: arrayUnion(cityRef.id),
    });
  }

  return new Promise<{
    data: { cityId: string; ledgerBookId: string; userNickName: string };
  }>((resolve) => resolve({ data: { cityId, ledgerBookId, userNickName } }));
}

export async function createNewCity(userId: string) {
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

  return new Promise<{
    cityId: string;
  }>((resolve) => resolve({ cityId: cityRef.id }));
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
    const data = docSnap.data() as UserDataState;
    return new Promise<{
      data: UserDataState;
    }>((resolve) => resolve({ data }));
  }
}

export async function postFadeOutTime(userId: string) {
  await setDoc(doc(db, 'allUserStatus', userId), {
    fadeOutTime: serverTimestamp(),
  });
}

export async function postFadeOutTimeRT(userId: string, enableType: string) {
  const logoutTime = new Date();
  set(ref(rtdb, `users/${userId}/logout`), {
    logoutTime: logoutTime,
    enableType: enableType,
  });
}

export async function updateActivity(userId: string, pageActivity: string) {
  await updateDoc(doc(db, 'allUserStatus', userId), {
    currentActivity: pageActivity,
    latestActiveTime: serverTimestamp(),
  });
}

export async function updateNickname(userId: string, userNickName: string) {
  await updateDoc(doc(db, 'users', userId), { userNickName: userNickName });
}

export async function searchFriend(email: string) {
  const q = query(collection(db, 'users'), where('userEmail', '==', email));
  const querySnapshot = await getDocs(q);
  let result: FriendInfoState[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as UserDataState;
    result.push({
      userId: data.userId,
      userName: data.userName,
      userNickName: data.userNickName,
      userEmail: data.userEmail,
      userPortraitUrl: data.userPortraitUrl,
    });
  });
  return new Promise<{ result: FriendInfoState[] }>((resolve) =>
    resolve({ result })
  );
}

export async function sendCooperationRequest(
  userId: string,
  friendId: string,
  cityId: string
) {
  const friendData = {
    coopCityId: cityId,
    coopStatus: 'beenInvited',
    userId: userId,
  };
  const selfData = {
    coopCityId: cityId,
    coopStatus: 'inviting',
    userId: friendId,
  };

  await setDoc(doc(db, 'users', userId, 'friends', friendId), selfData);
  await setDoc(doc(db, 'users', friendId, 'friends', userId), friendData);
}

export async function getFrinedsInfo(friendId: string) {
  const docSnap = await getDoc(doc(db, 'users', friendId));

  if (docSnap.exists()) {
    const data = docSnap.data() as UserDataState;
    const friendInfo = {
      userId: data.userId,
      userName: data.userName,
      userNickName: data.userNickName,
      userEmail: data.userEmail,
      userPortraitUrl: data.userPortraitUrl,
    };

    return new Promise<{ friendInfo: FriendInfoState }>((resolve) =>
      resolve({ friendInfo: friendInfo })
    );
  }
}

export async function agreeCooperation(
  userId: string,
  friendId: string,
  cityId: string,
  newCityList: string[]
) {
  await updateDoc(doc(db, 'users', userId, 'friends', friendId), {
    coopStatus: 'coorperated',
  });

  await updateDoc(doc(db, 'users', friendId, 'friends', userId), {
    coopStatus: 'coorperated',
  });

  await updateDoc(doc(db, 'users', userId), {
    cityList: newCityList,
  });

  await updateDoc(doc(db, 'cities', cityId), {
    accessUsers: arrayUnion(userId),
  });
}

export async function disagreeCooperation(userId: string, friendId: string) {
  await deleteDoc(doc(db, 'users', userId, 'friends', friendId));
  await deleteDoc(doc(db, 'users', friendId, 'friends', userId));
}

export async function updateCityList(userId: string, newCityList: string[]) {
  await updateDoc(doc(db, 'users', userId), {
    cityList: newCityList,
  });
}

export async function getOtherCityInfo(cityId: string) {
  const citySnap = await getDoc(doc(db, 'cities', cityId));
  if (citySnap.exists()) {
    const cityName = citySnap.data().cityName as string;
    const accessUsers = citySnap.data().accessUsers as string[];
    return new Promise<{ cityName: string; accessUsers: string[] }>((resolve) =>
      resolve({ cityName, accessUsers })
    );
  }
}
