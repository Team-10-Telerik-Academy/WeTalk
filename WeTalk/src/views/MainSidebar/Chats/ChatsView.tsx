import { useEffect, useState } from "react";
import CreateNewChat from "../../../components/CreateChat/CreateChat";
import {
  getAllChats,
  getLastMessage,
  onChatUpdate,
} from "../../../services/chat.service";
import { IAppContext } from "../../../common/types";
import AppContext from "../../../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Profile from "../../../components/Profile/Profile";
import SearchBar from "../../../components/SearchBar/SearchBar";
import GroupAvatar from "../../../components/Profile/GroupAvatar";

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

  const [lastMessages, setLastMessages] = useState<
    Record<string, IMessageType | null>
  >({});
  const [userSeenMessages, setUserSeenMessages] = useState<
    Record<string, IMessageType | null>
  >({});

  useEffect(() => {
    const initialLastMessages: Record<string, IMessageType | null> = {};
    const initialUserSeenMessages: Record<string, IMessageType | null> = {};

    chats.forEach((chat) => {
      getLastMessage(chat.chatId, (lastMessage) => {
        initialLastMessages[chat.chatId] = lastMessage;
        setLastMessages(initialLastMessages);
      });

      // Fetch and store the last message seen by the current user for each chat
      getLastMessage(chat.chatId, (userSeenMessage) => {
        initialUserSeenMessages[chat.chatId] = userSeenMessage;
        setUserSeenMessages(initialUserSeenMessages);
      });
    });
  }, [chats]);

  const userChats = chats.filter((chat) => {
    const membersHandle = chat.members.map((member) => member.handle);

    return membersHandle.includes(userData?.handle);
  });

  const group = userChats.filter((chat) => chat.members.length > 2);
  const personal = userChats.filter((chat) => chat.members.length <= 2);

  const groupChats = group.sort((a, b) => {
    const timestampA = lastMessages[a.chatId]?.timestamp || a.createdOn;
    const timestampB = lastMessages[b.chatId]?.timestamp || b.createdOn;
    return timestampB - timestampA;
  });
  const personalChats = personal.sort((a, b) => {
    const timestampA = lastMessages[a.chatId]?.timestamp || a.createdOn;
    const timestampB = lastMessages[b.chatId]?.timestamp || b.createdOn;
    return timestampB - timestampA;
  });

  const separateChats = (chatArray) => {
    return (
      <div>
        <div>
          {chatArray.length > 0 ? (
            chatArray.map((chat) => (
              <div
                key={chat.chatId}
                className="flex border bg-blue-500 rounded-lg p-2 my-2 items-center relative"
              >
                <Link
                  to={`${chat.chatId}`}
                  className="text-gray-500 tracking-wide"
                >
                  <div>
                    <div className="flex flex-row items-center gap-2">
                      {chat?.members.length > 2 ? (
                        <GroupAvatar chat={chat} />
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
                {lastMessages[chat.chatId]?.seenBy &&
                lastMessages[chat.chatId]?.seenBy[userData.handle] === false &&
                lastMessages[chat.chatId]?.sender !== userData?.handle ? (
                  <div className="absolute top-0 right-0 h-4 w-4 shadow-inner shadow-secondary/50 bg-error z-[1] rounded-full"></div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-white">No chats yet!</div>
          )}
        </div>
      </div>
    );
  };
  const [showPersonalChats, setShowPersonalChats] = useState(true);
  const [showGroupChats, setShowGroupChats] = useState(false);

  console.log(showPersonalChats);
  console.log(showGroupChats);

  const handlePersonalChats = () => {
    setShowPersonalChats(true);
    setShowGroupChats(false);
  };

  const handleGroupChats = () => {
    setShowPersonalChats(false);
    setShowGroupChats(true);
  };

  const containerStyle = {
    overflowY: "auto",
    maxHeight: "65vh",
    scrollbarWidth: "thin",
  };

  return (
    <div className="z-[1] min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen px-4 py-8 border-r overflow-y-auto bg-secondary w-full sm:w-1/2 md:w-1/2 lg:w-[300px] xl:w-[350px] 2xl:w-[400px]">
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
        <div className="flex justify-center">
          <button
            className={`relative px-2 text-sm lg:text-[16px] h-8 rounded-xl mr-4 ${
              showPersonalChats === true
                ? "bg-accent text-primary"
                : "bg-primary text-secondary"
            }`}
            onClick={handlePersonalChats}
          >
            Personal chats
            {userChats.some(
              (chat) =>
                lastMessages[chat.chatId]?.seenBy &&
                lastMessages[chat.chatId]?.seenBy[userData.handle] === false &&
                Object.keys(lastMessages[chat.chatId]?.seenBy).length < 2
            ) && (
              <div className="absolute top-0 right-0 h-2 w-2 bg-error z-[1] rounded-full"></div>
            )}
          </button>
          <button
            className={`relative px-2 text-sm lg:text-[16px] h-8 rounded-xl mr-4 ${
              showGroupChats === true
                ? "bg-accent text-primary"
                : "bg-primary text-secondary"
            }`}
            onClick={handleGroupChats}
          >
            Group chats
            {userChats.some(
              (chat) =>
                lastMessages[chat.chatId]?.seenBy &&
                lastMessages[chat.chatId]?.seenBy[userData.handle] === false &&
                Object.keys(lastMessages[chat.chatId]?.seenBy).length >= 2
            ) && (
              <div className="absolute top-0 right-0 h-2 w-2 bg-error z-[1] rounded-full"></div>
            )}
          </button>
        </div>
        <div style={containerStyle}>
          {showPersonalChats === true && (
            <div>{separateChats(personalChats)}</div>
          )}
        </div>
        <div style={containerStyle}>
          {showGroupChats === true && <div>{separateChats(groupChats)}</div>}
        </div>
      </nav>
    </div>
  );
};

export default ChatsView;
