import { Outlet } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';

const MainSidebarView = ({ isSidebarOpen }) => {
  return (
    <>
      <div
        className={`h-screen px-5 py-8 overflow-y-auto bg-secondary border-r sm:w-96 w-60 dark:bg-gray-900 dark:border-gray-700 ${
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
