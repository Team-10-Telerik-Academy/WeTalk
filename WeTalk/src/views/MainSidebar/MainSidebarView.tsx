import { Outlet } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';

type IMainSidebarView = {
  isSidebarOpen: boolean;
};

const MainSidebarView: React.FC<IMainSidebarView> = ({ isSidebarOpen }) => {
  return (
    <>
      <div
        className={`min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen px-5 py-8 border-r overflow-y-auto bg-secondary w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-full 2xl:w-full dark:bg-gray-900 dark:border-gray-700 ${
          isSidebarOpen ? '' : 'hidden'
        }`}
      >
        <SearchBar />
        <Outlet />
      </div>
    </>
  );
};

export default MainSidebarView;
