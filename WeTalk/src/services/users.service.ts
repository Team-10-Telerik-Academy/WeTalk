import {
  get,
  set,
  ref,
  query,
  equalTo,
  orderByChild,
  onValue,
  update,
} from 'firebase/database';
import { db } from '../config/firebase-config';
import { ICreateUserHandleParams, IUserData } from '../common/types';

export const getUserByHandle = async (handle: string) => {
  return await get(ref(db, `users/${handle}`));
};

export const getUserByHandleLive = (
  handle: string,
  callback: (user: IUserData) => void
) => {
  const userRef = ref(db, `users/${handle}`);

  const unsubscribe = onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    callback(userData);
  });

  return unsubscribe;
};

export const createUserHandle = async (
  handle: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  uid: string,
  email: string
) => {
  const userData: ICreateUserHandleParams = {
    uid,
    handle,
    firstName,
    lastName,
    email,
    phoneNumber,
    status: 'active',
    createdOn: Date.now(),
    teams: [],
    channels: [],
  };

  const userRef = ref(db, `users/${handle}`);
  return await set(userRef, userData);
};

export const getUserData = (uid: string) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

// export const getAllUsers = async () => {
//   try {
//     const userRef = ref(db, `users`);
//     const userSnapshot = await get(userRef);

//     if (userSnapshot.exists()) {
//       const usersData = userSnapshot.val();
//       const usersArray = Object.keys(usersData).map((handle) => ({
//         ...usersData[handle],
//       }));
//       return usersArray;
//     } else {
//       throw new Error(`Users not found`);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const getAllUsers = (callback: (usersArray: IUserData[]) => void) => {
  const usersRef = ref(db, 'users');

  const unsubscribe = onValue(usersRef, (snapshot) => {
    try {
      const usersData = snapshot.val();
      const usersArray = Object.keys(usersData || {}).map(
        (handle) => usersData[handle] as IUserData
      );
      callback(usersArray);
    } catch (error) {
      console.error('Error processing user data:', error);
    }
  });

  return unsubscribe;
};

export const setUserStatus = async (handle: string, status: string) => {
  const userStatusRef = ref(db, `users/${handle}`);
  return await update(userStatusRef, {
    status: status,
  });
};
