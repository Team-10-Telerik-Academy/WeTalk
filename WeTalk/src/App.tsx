import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.service';
import { useEffect, useState } from 'react';
import { IAppState, IUserData } from './common/types';
import AppContext from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home';
import AuthenticatedRoute from './hoc/AuthenticatedRoute';
// import ThemeButton from './components/ThemeButton/ThemeButton';
import { Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn/SignIn';
import Register from './components/Auth/Register/Register';
import Teams from './components/MainSidebar/Teams/Teams';
import Chats from './components/MainSidebar/Chats/Chats';
import SingleChatView from './views/Chat/SingleChatView';
import MainContent from './components/MainContent/MainContent';
import CurrentRoom from './components/Meeting/CurrentRoom';
import LandingPageView from './views/LandingPage/LandingPageView';
// import AuthenticatedRoute from './hoc/AuthenticatedRoute';
// import Register from './components/Auth/Register/Register';

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [appState, setAppState] = useState<IAppState>({
    user,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ ...appState, user });
  }

  useEffect(() => {
    if (user === null || user === undefined) return;

    getUserData(user.uid)
      .then((snapshot) => {
        console.log(snapshot.val());
        if (!snapshot.exists()) {
          throw new Error('Invalid user!');
        }

        const userData: IUserData =
          snapshot.val()[Object.keys(snapshot.val())[0]];

        setAppState({
          ...appState,
          userData,
        });
      })
      .catch((e) => console.error(e.message));
  }, [user]);

  if ((!user && !loading) || (!loading && user && appState.userData)) {
    return (
      <>
        <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />

            <Route element={<AuthenticatedRoute />}>
              <Route path="home" element={<Home />}>
                <Route path="" element={<MainContent />}></Route>
                <Route path="teams" element={<Teams />} />
                <Route path="chats" element={<Chats />}>
                  <Route path=":chatId" element={<SingleChatView />}>
                    <Route path=":roomId" element={<CurrentRoom />} />
                  </Route>
                </Route>
              </Route>
              <Route element={<LandingPageView />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<Register />} />
              </Route>
            </Route>
          </Routes>
        </AppContext.Provider>
      </>
    );
  }
};

export default App;
