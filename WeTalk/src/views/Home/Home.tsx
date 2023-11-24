import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase-config";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContext from "../../context/AuthContext";
import { IAppContext, IAppState } from "../../common/types";
// import nhAvatar from "../../assets/images/avatar-NH.jpg";
import Settings from "../../components/Profile/Settings";
import Profile from "../../components/Profile/Profile";
import SearchUsers from '../../components/SearchUsers/SearchUsers';
// import ThemeButton from '../../components/ThemeButton/ThemeButton';

export default function Home() {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState<IAppState>({
    user: null,
    userData: null,
  });

  const { userData } = useContext(AppContext) as IAppContext;
  const navigate = useNavigate();

  const url = userData?.imgUrl;

  if (appState.user !== user) {
    setAppState({ user, userData });
  }

  const onLogout = () => {
    logoutUser().then(() => {
      setAppState({
        user: null,
        userData: null,
      });
      navigate("/");
      toast.success(
        `See you soon, ${userData?.firstName} ${userData?.lastName}`,
        {
          autoClose: 3000,
          className: "font-bold",
        }
      );
    });
  };

  return (
    /*<>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-gray-800 text-secondary">
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
    </>*/

    <>
      <aside className="flex">
        <div className="flex flex-col items-center w-16 h-screen py-8 bg-primary rounded-r-3xl dark:bg-gray-900 dark:border-gray-700">
          <nav className="flex flex-col items-center flex-1 space-y-8 ">
            <h1 className="font-extrabold text-3xl text-secondary">W</h1>

            <div className="flex flex-col items-center justify-center">
              <a
                href="#"
                className="p-1.5 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:text-secondary hover:scale-125"
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
              </a>
              <span className="text-gray-300 text-xs">Home</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <a
                href="#"
                className="p-1.5 inline-block text-primary bg-secondary rounded-lg transition-colors duration-200 dark:text-blue-400 dark:bg-gray-800 hover:scale-110"
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
              </a>
              <span className="text-gray-300 text-xs mt-2">Teams</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <a
                href="#"
                className="p-1.5 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:text-secondary hover:scale-125"
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
                    d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                  />
                </svg>
              </a>
              <span className="text-gray-300 text-xs">Chats</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <a
                href="#"
                className="p-1.5 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:text-secondary hover:scale-125"
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
              <span className="text-gray-300 text-xs">Activity</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Settings></Settings>
              <span className="text-gray-300 text-xs">Settings</span>
            </div>
          </nav>

          <div className="flex flex-col items-center mt-4 space-y-4">
            <Profile handle={userData!.handle} />

            <a
              className="text-secondary transition-colors duration-200 rotate-180 cursor-pointer dark:text-gray-400 rtl:rotate-0 hover:scale-125 dark:hover:text-blue-400"
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

        <div className="h-screen px-5 py-8 overflow-y-auto bg-secondary border-r sm:w-72 w-60 dark:bg-gray-900 dark:border-gray-700">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                {/* <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path> */}
              </svg>
            </span>
            <SearchUsers />
            {/* <input
              type="text"
              className="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-secondary border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              placeholder="Search"
            /> */}
          </div>

          <nav className="mt-6 -mx-3 space-y-6">
            {/*<div className="space-y-3 ">
              <label className="px-3 text-xs text-gray-300 uppercase dark:text-gray-400">
                analytics
              </label>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:text-secondary dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Dashboard</span>
              </a>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:text-secondary dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Preformance</span>
              </a>
            </div>

            <div className="space-y-3 ">
              <label className="px-3 text-xs text-gray-300 uppercase dark:text-gray-400">
                content
              </label>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:text-secondary dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Guides</span>
              </a>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:text-secondary dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Hotspots</span>
              </a>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:text-secondary dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Checklists</span>
              </a>
            </div>

            <div className="space-y-3 ">
              <label className="px-3 text-xs text-gray-300 uppercase dark:text-gray-400">
                Customization
              </label>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:text-secondary dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Themes</span>
              </a>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:text-secondary dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="mx-2 text-sm font-medium">Setting</span>
              </a>
            </div>*/}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 font-bold ">
                <label className="text-primary text-2xl dark:text-gray-400">
                  Teams
                </label>
                <button className="text-primary text-lg text-center w-8 shadow-md rounded-lg border-primary border-2 px-1 hover:bg-primary hover:text-secondary">
                  +
                </button>
              </div>

              {/*<a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Dashboard</span>
              </a>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-primary"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>

                <span className="mx-2 text-sm font-medium">Preformance</span>
              </a>*/}
            </div>
            <hr className="mt-4" />
            <div>
              <p className="px-3 text-gray-500 tracking-wide">#Team1</p>
              <p className="px-3 text-gray-500 tracking-wide">#Team2</p>
              <p className="px-3 text-gray-500 tracking-wide">#Team3</p>
            </div>
          </nav>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4"></div>
        </div>
      </aside>
    </>
  );
}
