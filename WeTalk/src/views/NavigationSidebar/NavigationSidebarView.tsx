import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { IAppContext } from '../../common/types';
import Profile from '../../components/Profile/Profile';
import AppContext from '../../context/AuthContext';
import { useContext } from 'react';
import Settings from '../../components/Profile/Settings';

type NavigationSidebarViewProps = {
  onLogout: () => void;
};

const NavigationSidebarView: React.FC<NavigationSidebarViewProps> = ({
  onLogout,
}) => {
  // const isHomePage = location.pathname === '/home';

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
        
        
        px-2 min-h-screen sm:h-full md:min-h-screen lg:min-h-screen py-8 bg-primary`}
      >
        <nav className="flex flex-col items-center flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-secondary">W</h1>

          <div className="flex flex-col text-center items-center justify-center">
            <Link
              to="/"
              className="p-1 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 hover:text-secondary hover:scale-125"
              title="HOME"
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
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </Link>
            <span className="text-gray-300 text-xs tracking-tight">Home</span>
          </div>

          <div className="flex flex-col text-center items-center justify-center">
            <Link
              to="/home/teams"
              className="p-1 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 hover:text-secondary hover:scale-125"
              title="TEAMS"
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
            </Link>
            <span className="text-gray-300 text-xs tracking-tight">Teams</span>
          </div>

          <div className="flex flex-col text-center items-center justify-center">
            <Link to="/home/chats" title="CHATS">
              <FontAwesomeIcon
                icon={faCommentDots}
                size="lg"
                className="p-1 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 rounded-lg hover:text-secondary hover:scale-125"
              />
            </Link>
            <span className="text-gray-300 text-xs tracking-tight">Chats</span>
          </div>

          <div className="flex flex-col text-center items-center justify-center">
            <a
              href="#"
              className="p-1 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 rounded-lg hover:text-secondary hover:scale-125"
              title="ACTIVITY"
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
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </a>
            <span className="text-gray-300 text-xs tracking-tight">
              Activity
            </span>
          </div>

          <div className="flex flex-col text-center items-center justify-center">
            <Settings />
            <span className="text-gray-300 text-xs tracking-tight">
              Settings
            </span>
          </div>
        </nav>

        <div className="flex flex-col items-center mt-12 space-y-4">
          <a href="#" className="hover:scale-110">
            {/*<img
              className="object-cover w-10 h-10 rounded-full"
              src={nhAvatar}
              alt="avatar"
            />*/}
            <Profile handle={userData?.handle!} />
          </a>

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
      </div>
    </>
  );
};

export default NavigationSidebarView;
