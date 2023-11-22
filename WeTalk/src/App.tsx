import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.service';
import { useEffect, useState } from 'react';
import { IAppState, IUserData } from './common/types';
import AppContext from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import LandingPageView from './views/LandingPage/LandingPageView';
import Home from './views/Home/Home';
import AuthenticatedRoute from './hoc/AuthenticatedRoute';
import ThemeButton from './components/ThemeButton/ThemeButton';
// import Register from './components/Auth/Register/Register';

const App = () => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState<IAppState>({
    user,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ user, userData: null });
  }

  useEffect(() => {
    if (user === null || user === undefined) return;

    getUserData(user.uid)
      .then((snapshot) => {
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
  }, [appState, user]);

  return (
    <>
      <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
        <Routes>
          {user === null && <Route path="/" element={<LandingPageView />} />}
          {user !== null && (
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <Home />
                </AuthenticatedRoute>
              }
            />
          )}
          {user !== null && (
            <Route
              path="/home"
              element={
                <AuthenticatedRoute>
                  <Home />
                </AuthenticatedRoute>
              }
            />
          )}
          
        </Routes>
        
      </AppContext.Provider>
    </>
  );
};

export default App;
