import { useEffect, useState } from "react";
import {
  getUserByHandle,
  getUserByHandleLive,
} from "../../services/users.service";
import Status from "./Status";
import { IUserData } from "../../common/types";

interface ProfileProps {
  handle: string;
  status: string;
}

interface ProfileProps {
  handle: string;
  status: string;
}

const Profile: React.FC<ProfileProps> = ({ handle }) => {
  const [user, setUser] = useState<IUserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getUserByHandle(handle);
        const data = snapshot.val();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const userCallback = (userData: IUserData) => {
      setUser(userData);
    };

    const unsubscribe = getUserByHandleLive(handle, userCallback);

    fetchData();

    return () => {
      unsubscribe();
    };
  }, [handle]);

  return (
    <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
      {user ? (
        <div className="rounded-full h-12 w-12 flex items-center justify-center">
          {user.imgUrl ? (
            <div className="relative">
              <img
                src={user.imgUrl}
                alt="profile"
                className="rounded-full w-12 h-12 object-cover border border-primary "
              />
              <Status status={user.status!} />
            </div>
          ) : (
            <div className="relative text-primary text-center bg-secondary h-full w-full rounded-full flex items-center justify-center font-bold text-xl border border-primary">
              {user?.firstName[0]}
              {user?.lastName[0]}
              <Status status={user.status!} />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary rounded-full">
          <span className="text-primary text-center font-bold text-xl">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
