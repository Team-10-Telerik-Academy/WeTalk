import { Outlet } from 'react-router';
import ChatsView from '../../../views/MainSidebar/Chats/ChatsView';

const Chats = () => {
  return (
    <>
      <ChatsView />
      <Outlet />
    </>
  );
};

export default Chats;
