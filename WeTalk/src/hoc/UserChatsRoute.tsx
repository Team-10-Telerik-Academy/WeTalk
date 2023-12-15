import { useContext } from "react";
import AppContext from "../context/AuthContext";
import { IAppContext } from "../common/types";
import { Outlet, useLocation, useParams, Navigate } from "react-router-dom";

const UserChatsRoute = () => {
  const { userData } = useContext(AppContext) as IAppContext;
  const location = useLocation();
  const { chatId } = useParams();

  if (
    userData?.chats &&
    Object.keys(userData.chats).includes(chatId as string)
  ) {
    return <Outlet />;
  } else {
    return <Navigate to={"/home/chats"} replace state={location.pathname} />;
  }
};

export default UserChatsRoute;
