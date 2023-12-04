import { useEffect, useState } from 'react';
import CreateNewChat from '../../../components/CreateChat/CreateChat';
import { getAllChats, onChatUpdate } from '../../../services/chat.service';
import { IAppContext } from '../../../common/types';
import AppContext from '../../../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Profile from '../../../components/Profile/Profile';
import SearchBar from '../../../components/SearchBar/SearchBar';

type IChatData = {
  chatId: string;
  chatName: string;
  createdOn: number;
  members: string[];
  messages: {
    message: {
      message: string;
      sender: string;
      timestamp: number;
    };
  };
};

const ChatsView = () => {
  const [chats, setChats] = useState<IChatData[]>([]);
  const { userData } = useContext(AppContext) as IAppContext;

  useEffect(() => {
    const chatsCallback = (chatsData) => {
      setChats(chatsData);
      console.log(chatsData);
    };

    const unsubscribe = getAllChats(chatsCallback);

    return () => {
      unsubscribe();
    };
  }, []);

  // const unsubscribe = onChatUpdate(userData?.handle || "", (updatedChats) => {
  //   setChats(updatedChats);
  // });

  // return () => {
  //   unsubscribe();
  // };

  const userChats = chats.filter((chat) => {
    const membersHandle = chat.members.map((member) => member.handle);

    return membersHandle.includes(userData?.handle);
  });

  const groupChats = userChats.filter((chat) => chat.members.length > 2);
  const personalChats = userChats.filter((chat) => chat.members.length <= 2);

  const separateChats = (chatArray) => {
    return (
      <div>
        <div>
          {chatArray.length > 0 ? (
            chatArray.map((chat) => (
              <div
                key={chat.chatId}
                className="flex border bg-blue-500 rounded-lg p-2 my-2 items-center"
              >
                <Link
                  to={`${chat.chatId}`}
                  className="text-gray-500 tracking-wide"
                >
                  <div>
                    <div className="flex flex-row items-center gap-2">
                      {chat?.members.length > 2 ? (
                        <p className="pr-2 text-secondary">Group</p>
                      ) : (
                        <div>
                          {chat?.members
                            .filter(
                              (member) => member?.handle !== userData?.handle
                            )
                            .map((member) => (
                              <Profile
                                key={member?.handle}
                                handle={member?.handle}
                              />
                            ))}
                        </div>
                      )}
                      <div className="flex flex-col text-secondary">
                        <div className=" font-bold">
                          {chat?.members.length > 2
                            ? chat?.chatName
                            : chat?.members[0]?.handle !== userData?.handle
                            ? `${chat?.members[0]?.firstName} ${chat?.members[0]?.lastName}`
                            : `${chat?.members[1]?.firstName} ${chat?.members[1]?.lastName}`}
                        </div>
                        <div>
                          {chat?.messages
                            ? Object.values(chat?.messages)
                                .filter(
                                  (message) =>
                                    message.sender !== userData?.handle
                                )
                                .slice(-1)
                                .map((message) => (
                                  <div>{message.message.slice(0, 17)}...</div>
                                ))
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div>No chats yet!</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen px-4 py-8 border-r overflow-y-auto bg-secondary w-full sm:w-1/2 md:w-1/2 lg:w-[300px] xl:w-[350px] 2xl:w-[400px] dark:bg-gray-900 dark:border-gray-700">
      <SearchBar />
      <nav className="mt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-primary text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight uppercase dark:text-gray-400">
              Chats
            </label>
            <div className="flex items-center justify-between">
              <CreateNewChat />
            </div>
          </div>
        </div>
        <hr className="mt-4" />
        <div>
          <p className="px-2 text-gray-500 text-sm lg:text-[16px]">
            Personal chats
          </p>
          <div>{separateChats(personalChats)}</div>
        </div>
        <div>
          <p className="px-2 text-gray-500 text-sm lg:text-[16px]">
            Group chats
          </p>
          <div>{separateChats(groupChats)}</div>
        </div>
      </nav>
    </div>
  );
};

export default ChatsView;
