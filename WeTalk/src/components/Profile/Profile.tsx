import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AuthContext";
import { IAppContext } from "../../common/types";
import { getUserByHandle } from "../../services/users.service";

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
        console.log("Data received:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [handle]);

  return (
    <div className="w-12 h-12 rounded-full">
      {user ? (
        <a href="#" className="hover:scale-110">
          {user.imgUrl ? (
            <img src={user.imgUrl} alt="profile" className="rounded-full" />
          ) : (
            <span className="text-primary bg-secondary h-14 w-14 rounded-full font-bold text-xl p-2">
              {user.firstName[0]}
              {user.lastName[0]}
            </span>
          )}
        </a>
      ) : (
        // Handle loading state or show a placeholder
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Profile;
