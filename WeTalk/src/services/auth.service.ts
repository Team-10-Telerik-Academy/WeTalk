import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { setUserStatus } from './users.service';
import { UserStatus } from '../common/status-enum';

export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (
  email: string,
  password: string,
  handle: string
) => {
  await setUserStatus(handle, UserStatus.ONLINE.toLowerCase());
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (handle: string) => {
  await setUserStatus(handle, UserStatus.OFFLINE.toLowerCase());
  return await signOut(auth);
};
