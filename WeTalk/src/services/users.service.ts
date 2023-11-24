import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';
import { ICreateUserHandleParams } from '../common/types';

export const getUserByHandle = (handle: string) => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (
  handle: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  uid: string,
  email: string
): Promise<void> => {
  const userData: ICreateUserHandleParams = {
    uid,
    handle,
    firstName,
    lastName,
    email,
    phoneNumber,
    status: 'active',
    createdOn: Date.now(),
  };

  const userRef = ref(db, `users/${handle}`);
  return set(userRef, userData);
};

export const getUserData = (uid: string) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};
export const getAllUsers = async () => {
  try {
    const userRef = ref(db, `users`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const usersData = userSnapshot.val();
      const usersArray = Object.keys(usersData).map((userId) => ({
        id: userId,
        ...usersData[userId],
      }));
      return usersArray;
    } else {
      throw new Error(`Users not found`);
    }
  } catch (error) {
    console.error(error);
  }
};

export const filteredUsers = async (query: string) => {
  const users = await getAllUsers() || [];
  const queryToLowerCase = query.toLowerCase();
  const filteredUsers = users.filter((user) =>
  user.phoneNumber.includes(queryToLowerCase) ||
  user.email.includes(queryToLowerCase) ||
  user.handle.includes(queryToLowerCase) ||
  user.firstName.includes(queryToLowerCase) ||
  user.lastName.includes(queryToLowerCase)
  
  );
  return filteredUsers;
};
