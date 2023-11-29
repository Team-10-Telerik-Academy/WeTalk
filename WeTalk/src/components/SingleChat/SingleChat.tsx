import { useContext, useEffect, useState, useRef } from 'react';
import AppContext from '../../context/AuthContext';
import InputField from './InputField';
import { IAppContext } from '../../common/types';
import Profile from '../Profile/Profile';
import { onChatUpdate } from '../../services/chat.service';

type MessageType = {
  sender: string;
  message: string;
  timestamp: number;
};

type ChatType = {
  chatName: string;
  members: string[];
  messages: Record<string, MessageType>;
};

type SingleChatProps = {
  chatId: string;
};

const SingleChat: React.FC<SingleChatProps> = ({ chatId }) => {
  const { userData } = useContext(AppContext) as IAppContext;
  const [chat, setChat] = useState<ChatType | null>({
    chatName: '',
    members: [],
    messages: {},
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onChatUpdate(
      chatId,
      (chatData: ChatType) => {
        setChat(chatData);
      },
      (messagesData: Record<string, MessageType>) => {
        console.log('Messages updated:', messagesData);
        setChat((prevChat) => ({
          ...prevChat!,
          messages: messagesData,
        }));
      }
    );
    console.log(onChatUpdate);

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    console.log(chatContainerRef.current);
  }, [chat?.messages]);

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <h1 className="h-12 flex items-center justify-center text-2xl text-primary ml-14">
              {chat?.members.length! > 2
                ? chat?.chatName
                : chat?.members[0] !== userData?.handle
                ? chat?.members[0]
                : chat?.members[1]}
            </h1>
          </div>
          <p className="text-primary mr-4">settings</p>
        </div>
        <div className="h-0.5 w-full bg-accent"></div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto"
        style={{
          marginBottom: '2rem',
          overflowY: 'scroll',
        }}
      >
        <style>
          {`
              /* Hide scrollbar for Chrome */
              .flex-grow::-webkit-scrollbar {
                display: none;
              }
            `}
        </style>
        {chat ? (
          <h1 className="text-center mt-3 text-primary r">
            This is the start of your <br /> Conversation with
            <h1 className="font-bold">
              {chat?.members.length > 2
                ? chat?.chatName
                : chat?.members[0] !== userData?.handle
                ? chat?.members[0]
                : chat?.members[1]}
            </h1>
          </h1>
        ) : null}
        {chat && renderMessages(chat.messages, userData?.handle!)}
      </div>

      <div className="mt-auto mx-4">
        <div className="h-0.5 w-full bg-accent"></div>
        <InputField chatId={chatId} handle={userData?.handle!} />
      </div>
    </div>
  );
};

const renderMessages = (
  messages: Record<string, MessageType>,
  userHandle: string
) => {
  if (!messages || Object.keys(messages).length === 0) {
    return <div className="text-center mt-3 text-primary">No messages yet</div>;
  }

  return Object.values(messages).map((message) => (
    <div
      key={message.timestamp}
      className={`pl-2 chat w-full ${
        message.sender === userHandle ? 'chat-end pr-2' : 'chat-start'
      }`}
    >
      <div className="chat-image avatar">
        <div>
          <Profile handle={message.sender} />
        </div>
      </div>
      <div className="chat-header text-primary font-bold mt-2 ml-2 text-xl">
        {message.sender}
      </div>
      <div className="chat-bubble flex flex-col bg-primary text-secondary px-4 text-2xl">
        {message.message}
        <time className="text-xs opacity-50 mr-2 text-xl">
          {new Date(message.timestamp).toLocaleTimeString()}
        </time>
      </div>
    </div>
  ));
};

export default SingleChat;
