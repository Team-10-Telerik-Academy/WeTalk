import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import { IAppContext } from '../../common/types';
// import Profile from '../../components/Profile/Profile';
import AppContext from '../../context/AuthContext';
import { useContext, useState } from 'react';
import Settings from '../../components/Profile/Settings';
import Notifications from '../../components/Notifications/Notifications';

type NavigationSidebarViewProps = {
  onLogout: () => void;
};

const NavigationSidebarView: React.FC<NavigationSidebarViewProps> = ({
  onLogout,
}) => {
  // const isHomePage = location.pathname === '/home';
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [activeNavLink, setActiveNavLink] = useState('');

  const openNotificationsModal = () => {
    setIsNotificationsModalOpen(true);
  };

  const closeNotificationsModal = () => {
    setIsNotificationsModalOpen(false);
  };

  const handleActiveLink = (linkName: string) => {
    setActiveNavLink(linkName);
  };

  const { userData } = useContext(AppContext) as IAppContext;
  return (
    <>
      {/* Review this 
      ${
          isHomePage
            ? "xl:w-[300px] 2xl:w-[250px]"
            : "xl:w-[250px] 2xl:w-[350px]"
        }  */}
      <div
        className={`flex flex-col items-center w-20 
        
        
        px-2 min-h-screen sm:h-full md:min-h-screen lg:h-screen py-8 bg-primary`}
      >
        <nav className="flex flex-col items-center flex-1 justify-between space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center gap-1">
              <NavLink to="/" title="HOME">
                <h1 className="font-extrabold text-4xl text-secondary p-1">
                  W
                </h1>
                <p className="text-secondary font-light text-sm tracking-wide">
                  WeTalk
                </p>
              </NavLink>
            </div>

            <div className="flex flex-col text-center items-center justify-center">
              <NavLink
                to="teams"
                className={`p-1 inline-block hover:text-secondary hover:scale-125 ${
                  activeNavLink === 'teams'
                    ? 'text-secondary scale-125'
                    : 'text-gray-300 scale-100'
                }`}
                title="TEAMS"
                onClick={() => handleActiveLink('teams')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </NavLink>
              <span className="text-gray-300 text-xs tracking-tight">
                Teams
              </span>
            </div>

            <div className="flex flex-col text-center items-center justify-center">
              <NavLink to="chats" title="CHATS">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  size="lg"
                  className={`p-1 inline-block text-gray-300 rounded-lg hover:text-secondary hover:scale-125 ${
                    activeNavLink === 'chats'
                      ? 'text-secondary scale-125'
                      : 'text-gray-300 scale-100'
                  }`}
                  onClick={() => handleActiveLink('chats')}
                />
              </NavLink>
              <span className="text-gray-300 text-xs tracking-tight">
                Chats
              </span>
            </div>

            <Notifications
              isNotificationsModalOpen={isNotificationsModalOpen}
              openNotificationsModal={openNotificationsModal}
              closeNotificationsModal={closeNotificationsModal}
            />

            <div className="flex flex-col text-center items-center justify-center">
              <NavLink to="open-ai" title="Open AI">
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={`bg-gray-300 w-6 h-6 rounded-full hover:bg-secondary hover:scale-110 cursor-pointer text-primary text-xs tracking-tight text-center font-bold flex items-center justify-center mb-1 mt-1 ${
                      activeNavLink === 'open-ai'
                        ? 'bg-secondary scale-110'
                        : 'bg-gray-300 scale-100'
                    }`}
                    onClick={() => handleActiveLink('open-ai')}
                  >
                    GPT
                  </div>
                  <span className="text-gray-300 text-xs tracking-tight">
                    Open AI
                  </span>
                </div>
              </NavLink>
            </div>

            <div className="flex flex-col text-center items-center justify-center">
              <NavLink to="calendar" title="CALENDAR">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  size="lg"
                  className={`p-1 inline-block text-gray-300 rounded-lg mt-1 hover:text-secondary hover:scale-125 ${
                    activeNavLink === 'calendar'
                      ? 'text-secondary scale-125'
                      : 'text-gray-300 scale-100'
                  }`}
                  onClick={() => handleActiveLink('calendar')}
                />
                <span className="text-gray-300 text-xs tracking-tight">
                  Calendar
                </span>
              </NavLink>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col text-center items-center justify-center">
              <Settings />
            </div>
            <a
              className="text-secondary transition-colors duration-200 rotate-180 cursor-pointer rtl:rotate-0 hover:scale-125"
              onClick={onLogout}
              title="LOGOUT"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavigationSidebarView;
