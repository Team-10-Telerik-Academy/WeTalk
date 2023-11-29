import { useEffect, useState } from "react";
import { getUserByHandle } from "../../services/users.service";
import Status from "./Status";

interface ProfileProps {
  handle: string;
}

const Profile: React.FC<ProfileProps> = ({ handle }) => {
  const [user, setUser] = useState<any>(null);

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

    fetchData();
  }, [handle]);

  return (
    <div className="relative w-14 h-14 rounded-full overflow-hidden ml-2 mb-2">
      {user ? (
        <div className="rounded-full border h-12 w-12">
          {user.imgUrl ? (
            <div className="relative">
              <img
                src={user.imgUrl}
                alt="profile"
                className="rounded-full w-full h-full object-cover"
              />
              <Status status={user.status.value} />
            </div>
          ) : (
            <div className="relative text-primary text-center bg-secondary h-full w-full rounded-full flex items-center justify-center font-bold text-xl">
              {user.firstName[0]}
              {user.lastName[0]}
              <Status status={user.status.value} />
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
