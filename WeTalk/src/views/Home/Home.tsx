import { NavLink } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-config';
import { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '../../context/AuthContext';
import { IAppContext, IAppState } from '../../common/types';
import ThemeButton from '../../components/ThemeButton/ThemeButton';

export default function Home() {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState<IAppState>({
    user: null,
    userData: null,
  });

  const { userData } = useContext(AppContext) as IAppContext;

  if (appState.user !== user) {
    setAppState({ user, userData });
  }

  const onLogout = () => {
    logoutUser().then(() => {
      setAppState({
        user: null,
        userData: null,
      });
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
    <>
      <div className="flex h-screen bg-primary">
        <div className="w-64 bg-primary text-white">
          <div className="p-4">
            <span className="text-xl text-secondary font-extrabold">WeTalk</span>
          </div>
          <nav className="mt-4">
            <NavLink
              to="/"
              className="block py-2 px-4 text-sm text-secondary hover:bg-gray-700"
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="block py-2 px-4 text-secondary text-sm hover:bg-gray-700"
            >
              About
            </NavLink>
            <NavLink
              to="/teams"
              className="block py-2 px-4 text-sm text-secondary hover:bg-gray-700"
            >
              Teams
            </NavLink>
            <NavLink
              to="/channels"
              className="block py-2 px-4 text-sm text-secondary hover:bg-gray-700"
            >
              Channels
            </NavLink>
          </nav>
          <ThemeButton />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-end p-3 bg-secondary border-b">
            <div className="relative">
              <button
                onClick={onLogout}
                className="font-bold block px-4 py-2 text-primary text-md hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary p-4"></div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
