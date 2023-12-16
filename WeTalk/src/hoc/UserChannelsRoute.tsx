import { useContext } from "react";
import AppContext from "../context/AuthContext";
import { IAppContext } from "../common/types";
import { Outlet, useLocation, useParams, Navigate } from "react-router-dom";

const UserChannelsRoute = () => {
  const { userData } = useContext(AppContext) as IAppContext;
  const location = useLocation();
  const { channelId } = useParams();
  console.log(channelId);

  if (
    userData?.channels &&
    Object.keys(userData.channels).includes(channelId as string)
  ) {
    return <Outlet />;
  } else {
    return <Navigate to={"/home/teams"} replace state={location.pathname} />;
  }
};

export default UserChannelsRoute;
