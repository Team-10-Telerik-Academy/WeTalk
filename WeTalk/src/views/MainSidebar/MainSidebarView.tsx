import { Outlet } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";

const MainSidebarView: React.FC = () => {
  return (
    <>
      <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen px-5 py-8 border-r overflow-y-auto bg-secondary w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-full 2xl:w-full">
        <SearchBar />
        <Outlet />
      </div>
    </>
  );
};

export default MainSidebarView;
