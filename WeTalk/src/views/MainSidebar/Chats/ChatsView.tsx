import { useEffect, useState } from "react";
import CreateNewChat from "../../../components/CreateChat/CreateChat";
import { getAllChats, onChatUpdate } from "../../../services/chat.service";
import { IAppContext } from "../../../common/types";
import AppContext from "../../../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Profile from "../../../components/Profile/Profile";

type IChatData = {
  chatId: string;
  chatName: string;
  createdOn: number;
  members: string[];
};

const ChatsView = () => {
  const [chats, setChats] = useState<IChatData[]>([]);
  const { userData } = useContext(AppContext) as IAppContext;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatData = await getAllChats();
        setChats(chatData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();

    // const unsubscribe = onChatUpdate(userData?.handle || "", (updatedChats) => {
    //   setChats(updatedChats);
    // });

    // return () => {
    //   unsubscribe();
    // };
  }, [userData]);

  const userChats = chats.filter((chat) =>
    chat.members.includes(userData?.handle || "")
  );

  return (
    <div className="flex w-1/4 px-4 border-r">
      <nav className="mt-6 -mx-3 space-y-6 w-full">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 font-bold">
            <label className="text-primary text-2xl dark:text-gray-400">
              Chats
            </label>
            <CreateNewChat />
          </div>
        </div>
        <hr className="mt-4" />
        <div>
          {userChats.map((chat) => (
            <div key={chat.chatId}>
              <Link
                to={`${chat.chatId}`}
                className="text-gray-500 tracking-wide"
              >
                <div className="flex bg-secondary my-2 border-b">
                  <div className="flex flex-row">
                    {chat?.members.length > 2 ? (
                      <p className="pr-2 text-primary">group</p>
                    ) : (
                      <div>
                        {chat.members
                          .filter((member) => member !== userData?.handle)
                          .map((member) => (
                            <Profile key={member} handle={member} />
                          ))}
                      </div>
                    )}
                    <div className="text-primary">
                      {chat?.members.length > 2
                        ? chat?.chatName
                        : chat?.members[0] !== userData?.handle
                        ? chat?.members[0]
                        : chat?.members[1]}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ChatsView;
