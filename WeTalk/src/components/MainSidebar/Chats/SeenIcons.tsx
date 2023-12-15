import { useEffect, useState } from "react";
import { IUserData } from "../../common/types";
import {
  getUserByHandleLive,
  getUserByHandle,
} from "../../../services/users.service";

interface ProfileProps {
  handle: string;
}

const SeenIcons: React.FC<ProfileProps> = ({ handle }) => {
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
    <div className="relative w-6 pt-1 h-6 rounded-full flex items-center justify-center">
      {user ? (
        <div className="rounded-full h-6 w-6 flex items-center justify-center">
          {user.imgUrl ? (
            <div className="relative">
              <img
                src={user.imgUrl}
                alt="profile"
                className="rounded-full w-6 h-6 object-cover border border-primary "
              />
            </div>
          ) : (
            <div className="relative text-primary text-center bg-secondary h-6 w-6 rounded-full flex items-center justify-center font-bold text-sm border border-primary">
              {user?.firstName[0]}
              {user?.lastName[0]}
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

export default SeenIcons;
