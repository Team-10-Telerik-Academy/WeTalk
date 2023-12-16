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
import CurrentVideoRoom from './components/Meeting/CurrentVideoRoom';
import LandingPageView from './views/LandingPage/LandingPageView';
import OpenAI from './components/OpenAI/OpenAI';
import CurrentAudioRoom from './components/Meeting/CurrentAudioRoom';
import BigCalendar from './components/Calendar/BigCalendar';
import SingleChannelView from './views/MainSidebar/Teams/Channels/SingleChannelView';
import UserChatsRoute from './hoc/UserChatsRoute';
// import UserChannelsRoute from './hoc/UserChannelsRoute';

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
        if (!snapshot.exists()) {
          throw new Error('Invalid user!');
        }
        console.log('user data fetched');

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
                <Route path="" element={<MainContent />} />

                <Route path="teams" element={<Teams />}>
                  {/* <Route element={<UserChannelsRoute />}> */}
                  <Route path=":channelId" element={<SingleChannelView />} />
                  {/* </Route> */}
                </Route>
                <Route path="chats" element={<Chats />}>
                  <Route element={<UserChatsRoute />}>
                    <Route path=":chatId" element={<SingleChatView />} />
                  </Route>
                </Route>

                <Route
                  path="video-room/:chatId/:videoRoomId"
                  element={<CurrentVideoRoom />}
                />
                <Route
                  path="audio-room/:chatId/:audioRoomId"
                  element={<CurrentAudioRoom />}
                />
                <Route path="open-ai" element={<OpenAI />} />
                <Route path="calendar" element={<BigCalendar />} />
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
