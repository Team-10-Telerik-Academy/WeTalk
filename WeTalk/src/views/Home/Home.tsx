import { Outlet, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-config';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '../../context/AuthContext';
import { IAppContext, IAppState } from '../../common/types';
import NavigationSidebarView from '../NavigationSidebar/NavigationSidebarView';

export const Home = () => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState<IAppState>({
    user: null,
    userData: null,
  });

  const { userData } = useContext(AppContext) as IAppContext;

  // const url = userData?.imgUrl;

  if (appState.user !== user) {
    setAppState({ user, userData });
  }

  const navigate = useNavigate();

  const onLogout = () => {
    logoutUser(userData?.handle).then(() => {
      setAppState({
        user: null,
        userData: null,
      });
      navigate('/');
      toast.success(
        `See you soon, ${userData?.firstName} ${userData?.lastName}`,
        {
          autoClose: 3000,
          className: 'font-bold',
        }
      );
    });
  };

  return (
    <div className="flex w-full bg-gray-100">
      <aside className="flex">
        <NavigationSidebarView onLogout={onLogout} />
      </aside>
      <div className="flex w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
