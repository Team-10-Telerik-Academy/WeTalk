import { Outlet } from "react-router";
import ChatsView from "../../../views/MainSidebar/Chats/ChatsView";

const Chats = () => {
  return (
    <div className="flex w-full">
      <ChatsView />
      <Outlet />
    </div>
  );
};

export default Chats;
