import { User } from 'firebase/auth';
import { Dispatch, SetStateAction, ReactElement } from 'react';

export interface IAppState {
  user: User | null | undefined;
  userData: IUserData | null | undefined;
}

export interface IUserData {
  handle: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IAppContext extends IAppState {
  setContext: Dispatch<SetStateAction<IAppState>>;
}

export interface ICreateUserHandleParams {
  handle: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  uid: string;
  email: string;
  status: string;
  createdOn: number;
}

export interface IChildrenProps {
  children: ReactElement;
}
