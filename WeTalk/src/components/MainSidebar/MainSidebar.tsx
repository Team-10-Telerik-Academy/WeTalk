import MainSidebarView from '../../views/MainSidebar/MainSidebarView';

const MainSidebar = ({ isSidebarOpen }) => {
  return (
    <>
      <MainSidebarView isSidebarOpen={isSidebarOpen} />
    </>
  );
};

export default MainSidebar;
