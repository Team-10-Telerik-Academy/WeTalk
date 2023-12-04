import { useEffect, useState } from 'react';
import { getUserByHandleLive } from '../../services/users.service';
import Status from './Status';
import { IUserData } from '../../common/types';

interface ProfileProps {
  handle: string;
}

const Profile: React.FC<ProfileProps> = ({ handle }) => {
  const [user, setUser] = useState<IUserData>(null);

  useEffect(() => {
    const userCallback = (userData: IUserData) => {
      setUser(userData);
      console.log(userData);
    };

    const unsubscribe = getUserByHandleLive(handle, userCallback);
    console.log(unsubscribe);

    return () => {
      unsubscribe();
      console.log(unsubscribe);
    };
  }, [handle]);

  return (
    <div className="relative w-14 h-14 rounded-full flex items-center justify-center">
      {user ? (
        <div className="rounded-full h-12 w-12 flex items-center justify-center">
          {user.imgUrl ? (
            <div className="relative">
              <img
                src={user.imgUrl}
                alt="profile"
                className="rounded-full w-12 h-12 object-cover"
              />
              <Status status={user.status} />
            </div>
          ) : (
            <div className="relative text-primary text-center bg-secondary h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl border-2 border-primary">
              {user.firstName[0]}
              {user.lastName[0]}
              <Status status={user.status} />
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
