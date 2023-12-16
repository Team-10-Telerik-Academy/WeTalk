import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { setUserStatus } from './users.service';
import { UserStatus } from '../common/status-enum';

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string, handle: string) => {
  setUserStatus(handle, UserStatus.ONLINE.toLowerCase());
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = (handle: string) => {
  setUserStatus(handle, UserStatus.OFFLINE.toLowerCase());
  return signOut(auth);
};
