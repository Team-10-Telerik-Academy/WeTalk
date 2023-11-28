import NavigationSidebarView from '../../views/NavigationSidebar/NavigationSidebarView';

type NavigationSidebarProps = {
  onLogout: () => void;
  toggleSidebar: () => void;
};

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  onLogout,
  toggleSidebar,
}) => {
  return (
    <>
      <NavigationSidebarView
        onLogout={onLogout}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
};

export default NavigationSidebar;
