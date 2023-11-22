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
