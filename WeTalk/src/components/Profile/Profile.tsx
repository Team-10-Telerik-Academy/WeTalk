import { useContext } from "react";
import AppContext from "../../context/AuthContext";
import { IAppContext } from "../../common/types";

interface ProfileProps {
  url: string;
}

const Profile: React.FC<ProfileProps> = ({ url }) => {
  const imgUrl = url;
  const { userData } = useContext(AppContext) as IAppContext;

  return (
    <div className="w-12 h-12 rounded-full">
      {userData?.imgUrl ? (
        <a href="#" className="hover:scale-110">
          <img src={userData?.imgUrl} alt="profile" className="rounded-full" />
        </a>
      ) : (
        <a href="#" className="hover:scale-110">
          <span className="text-primary bg-secondary h-14 w-14 rounded-full font-bold text-xl p-2">
            {userData?.firstName[0]}
            {userData?.lastName[0]}
          </span>
        </a>
      )}
    </div>
  );
};

export default Profile;
