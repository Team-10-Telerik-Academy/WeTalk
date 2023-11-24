import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-config';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '../../context/AuthContext';
import { IAppContext, IAppState } from '../../common/types';
import NavigationSidebar from '../../components/NavigationSidebar/NavigationSidebar';
import MainSidebar from '../../components/MainSidebar/MainSidebar';
import MainContent from '../../components/MainContent/MainContent';
// import ThemeButton from '../../components/ThemeButton/ThemeButton';

export const Home = () => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState<IAppState>({
    user: null,
    userData: null,
  });

  const { userData } = useContext(AppContext) as IAppContext;

  if (appState.user !== user) {
    setAppState({ user, userData });
  }

  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logoutUser().then(() => {
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevIsSidebarOpen) => !prevIsSidebarOpen);
  };

  const isHomePage = location.pathname === '/home';

  return (
    <>
      <aside className="flex">
        <NavigationSidebar onLogout={onLogout} toggleSidebar={toggleSidebar} />
        {!isHomePage && <MainSidebar isSidebarOpen={isSidebarOpen} />}
        <MainContent />
      </aside>
    </>
  );
};

export default Home;
