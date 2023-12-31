import { useEffect, useState } from 'react';
import CreateNewChat from '../../../components/CreateChat/CreateChat';
import {
  getAllChats,
  getLastMessage,
  onChatUpdate,
} from '../../../services/chat.service';
import { IAppContext } from '../../../common/types';
import AppContext from '../../../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Profile from '../../../components/Profile/Profile';
import SearchBar from '../../../components/SearchBar/SearchBar';
import GroupAvatar from '../../../components/Profile/GroupAvatar';

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
      console.log('fetched chats');
    };

    const unsubscribe = getAllChats(chatsCallback);

    return () => {
      unsubscribe();
    };
  }, []);

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
      <>
        {chatArray.length > 0 ? (
          chatArray.map((chat) => (
            <Link
              to={`${chat.chatId}`}
              className="text-gray-500 tracking-wide"
              key={chat.chatId}
            >
              <div className="flex bg-blue-500 rounded-lg p-2 pl-1.5 pr-3 my-2 items-center hover:bg-blue-600 justify-between relative">
                <div className="flex items-center gap-2">
                  {chat?.members.length > 2 ? (
                    <GroupAvatar chat={chat} />
                  ) : (
                    <div>
                      {chat?.members
                        .filter((member) => member?.handle !== userData?.handle)
                        .map((member) => (
                          <Profile
                            key={member?.handle}
                            handle={member?.handle}
                          />
                        ))}
                    </div>
                  )}
                  <div className="flex flex-col text-secondary">
                    <div className="font-bold text-md">
                      {chat?.members.length > 2
                        ? chat?.chatName
                        : chat?.members[0]?.handle !== userData?.handle
                        ? `${chat?.members[0]?.firstName} ${chat?.members[0]?.lastName}`
                        : `${chat?.members[1]?.firstName} ${chat?.members[1]?.lastName}`}
                    </div>
                    <div className="text-sm tracking-tight">
                      {chat?.messages
                        ? Object.values(chat?.messages)
                            .filter(
                              (message) => message.sender !== userData?.handle
                            )
                            .slice(-1)
                            .map((message) => (
                              <div key={message.timestamp}>
                                {message.message.slice(0, 25)}
                                {message.message.length > 25 && <>...</>}
                              </div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-secondary tracking-wide">
                  {chat?.messages
                    ? Object.values(chat?.messages)
                        .filter(
                          (message) => message.sender !== userData?.handle
                        )
                        .slice(-1)
                        .map((message) => (
                          <div key={message.timestamp}>
                            {new Date(message.timestamp).toLocaleTimeString(
                              'en-US',
                              {
                                day: 'numeric',
                                month: 'short',
                                hour: 'numeric',
                                minute: 'numeric',
                              }
                            )}
                          </div>
                        ))
                    : null}
                </div>
                {lastMessages[chat.chatId]?.seenBy &&
                lastMessages[chat.chatId]?.seenBy[userData.handle] === false &&
                lastMessages[chat.chatId]?.sender !== userData?.handle ? (
                  <div className="absolute top-0 right-0 h-4 w-4 shadow-inner shadow-secondary/50 bg-error z-[1] rounded-full"></div>
                ) : null}
              </div>
            </Link>
          ))
        ) : (
          <div>No chats yet!</div>
        )}
      </>
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
    overflowY: 'auto',
    maxHeight: '65vh',
    scrollbarWidth: 'thin',
  };

  return (
    <div className="bg-secondary ml-4 rounded-xl drop-shadow-lg min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen px-4 py-4 border-r overflow-y-auto w-full sm:w-1/2 md:w-1/2 lg:w-[300px] xl:w-[500px] 2xl:w-[600px] dark:bg-gray-900 dark:border-gray-700">
      <SearchBar />
      <nav className="mt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-primary text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight uppercase">
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
                ? 'bg-accent text-primary'
                : 'bg-primary text-secondary'
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
                ? 'bg-accent text-primary'
                : 'bg-primary text-secondary'
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
