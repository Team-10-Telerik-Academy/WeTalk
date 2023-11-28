import { User } from 'firebase/auth';
import { Dispatch, SetStateAction, ReactElement } from 'react';

export interface IAppState {
  user: User | null | undefined;
  userData: IUserData | null | undefined;
}

export type IUserData = {
  handle: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imgUrl: string;
};

export interface IAppContext extends IAppState {
  setContext: Dispatch<SetStateAction<IAppState>>;
}

export type ICreateUserHandleParams = {
  handle: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  uid: string;
  email: string;
  status: string;
  createdOn: number;
  teams: string[];
  channels: string[];
};

export type IChildrenProps = {
  children: ReactElement;
};

export type ITeam = {
  teamName: string;
  members: string[];
  owner: string;
  teamId: string;
  createdOn: number | undefined;
};
