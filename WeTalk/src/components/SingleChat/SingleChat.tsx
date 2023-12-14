import { useContext, useEffect, useState, useRef } from 'react';
import AppContext from '../../context/AuthContext';
import InputField from './InputField';
import { IAppContext } from '../../common/types';
import Profile from '../Profile/Profile';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { onChatUpdate } from '../../services/chat.service';
import { ref, update } from 'firebase/database';
import { db } from '../../config/firebase-config';

type MessageType = {
  sender: string;
  message: string;
  timestamp: number;
};

type ChatType = {
  chatName: string;
  members;
  messages: Record<string, MessageType>;
  audioRoomInfo: any;
  videoRoomInfo: any;
};

type SingleChatProps = {
  chatId: string;
};

const SingleChat: React.FC<SingleChatProps> = ({ chatId }) => {
  const { userData } = useContext(AppContext) as IAppContext;
  const [chat, setChat] = useState<ChatType | null>(null);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Update typing status in Firebase
    update(ref(db, `chats/${chatId}/typingStatus`), {
      [userData?.handle!]: value !== '', // Set to true if input is not empty
    });
  };

  const renderTypingIndicator = () => {
    if (typingStatus && typeof typingStatus === 'object') {
      const typingMembers = Object.keys(typingStatus).filter(
        (member) => typingStatus[member] && member !== userData?.handle
      );

      if (typingMembers.length > 0) {
        const indicatorText =
          typingMembers.length === 1
            ? `${typingMembers[0]} is typing...`
            : `${typingMembers.join(', ')} are typing...`;

        return (
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-gray-500 rounded-full mr-1"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full mr-1"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full mr-1"></div>
            </div>
            <p className="ml-1">{indicatorText}</p>
          </div>
        );
      }
    }

    return null;
  };

  useEffect(() => {
    const unsubscribe = onChatUpdate(
      chatId,
      (chatData: ChatType) => {
        setChat(chatData);
      },
      (messagesData: Record<string, MessageType>) => {
        console.log('Messages updated');
        setChat((prevChat) => ({
          ...prevChat!,
          messages: messagesData,
        }));
      },
      (typingStatus: Record<string, boolean>) => {
        console.log('Typing status updated');
        setTypingStatus(typingStatus);
      }
    );
    console.log('chat updated');

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    console.log('chat container');
  }, [chat?.messages]);

  const handleVideoCallButtonClick = () => {
    if (chat?.videoRoomInfo.videoRoomId) {
      console.log('Video room opened');
    }
  };

  const handleAudioCallButtonClick = () => {
    if (chat?.audioRoomInfo.audioRoomId) {
      console.log('Audio room opened');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex items-center justify-between py-2 border-b">
        <div className="flex justify-start items-center px-4">
          <div className="text-primary">
            {chat?.members.length > 2 ? (
              chat?.chatName
            ) : chat?.members[0]?.handle !== userData?.handle ? (
              chat?.members[0]?.firstName && chat?.members[0]?.lastName ? (
                <div className="flex flex-col text-xl font-bold">
                  {`${chat?.members[0]?.firstName} ${chat?.members[0]?.lastName}`}{' '}
                  <span className="text-primary text-opacity-50 text-sm tracking-wide">{`@${chat?.members[0]?.handle}`}</span>
                </div>
              ) : (
                'Loading...'
              )
            ) : chat?.members[1]?.firstName && chat?.members[1]?.lastName ? (
              <div className="flex flex-col text-xl font-bold">
                {`${chat?.members[1]?.firstName} ${chat?.members[1]?.lastName}`}{' '}
                <span className="text-primary text-opacity-50 text-sm tracking-wide">{`@${chat?.members[1]?.handle}`}</span>
              </div>
            ) : (
              'Loading...'
            )}
          </div>
        </div>
        {chat ? (
          <div className="flex justify-between items-center gap-2 px-4">
            <Link
              to={
                chat?.audioRoomInfo.audioRoomId
                  ? `/home/audio-room/${chatId}/${chat?.audioRoomInfo.audioRoomId}`
                  : ''
              }
              target="_blank"
            >
              <button
                className="bg-blue-500 text-secondary px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleAudioCallButtonClick}
              >
                {chat?.audioRoomInfo.audioRoomParticipants &&
                Object.keys(chat?.audioRoomInfo.audioRoomParticipants).length >
                  0 ? (
                  <span className="animate-pulse">Ongoing audio call...</span>
                ) : (
                  <FontAwesomeIcon icon={faPhone} />
                )}
              </button>
            </Link>
            <Link
              to={
                chat?.videoRoomInfo.videoRoomId
                  ? `/home/video-room/${chatId}/${chat?.videoRoomInfo.videoRoomId}`
                  : ''
              }
              target="_blank"
            >
              <button
                className="bg-blue-500 text-secondary px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleVideoCallButtonClick}
              >
                {chat?.videoRoomInfo.videoRoomParticipants &&
                Object.keys(chat?.videoRoomInfo.videoRoomParticipants).length >
                  0 ? (
                  <span className="animate-pulse">Ongoing video call...</span>
                ) : (
                  <FontAwesomeIcon icon={faVideo} />
                )}
              </button>
            </Link>
            <button className="bg-blue-500 text-secondary px-4 py-2 rounded hover:bg-blue-600">
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>
        ) : (
          <div className="px-4">Loading...</div>
        )}
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto relative"
        style={{
          marginBottom: '2rem',
          overflowY: 'scroll',
          scrollbarWidth: 'none', // For Firefox
          msOverflowStyle: 'none', // For IE and Edge
        }}
      >
        <style>
          {`
            /* Hide scrollbar for Chrome */
            .flex-grow::-webkit-scrollbar {
              width: 0 !important;
              display: none;
            }

            /* Hide scrollbar for Firefox */
            .flex-grow {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          `}
        </style>
        {chat ? (
          <div className="text-center mt-3 text-primary">
            This is the start of your conversation with
            <div>
              {chat?.members.length > 2
                ? chat?.chatName
                : chat?.members[0]?.handle !== userData?.handle
                ? chat?.members[0]?.firstName && chat?.members[0]?.lastName
                  ? `${chat?.members[0]?.firstName} ${chat?.members[0]?.lastName} (${chat?.members[0]?.handle})`
                  : 'Loading...'
                : chat?.members[1]?.firstName && chat?.members[1]?.lastName
                ? `${chat?.members[1]?.firstName} ${chat?.members[1]?.lastName} (${chat?.members[1]?.handle})`
                : 'Loading...'}
            </div>
          </div>
        ) : (
          <div className="text-center mt-3 text-primary">
            Loading chat details...
          </div>
        )}
        {chat && renderMessages(chat.messages, userData?.handle!, chat.members)}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="fixed bottom-24 animate-pulse">
          <div className="text-sm text-center text-gray-500 italic">
            {renderTypingIndicator()}
          </div>
        </div>
        <InputField
          chatId={chatId}
          handle={userData?.handle!}
          setInputValue={setInputValue}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

const renderTime = (timestamp, isToday, isYesterday) => (
  <time>
    {isToday
      ? `Today at ${new Date(timestamp).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })}`
      : isYesterday
      ? `Yesterday at ${new Date(timestamp).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })}`
      : new Date(timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
  </time>
);

const renderChatBubble = (message, userHandle, members, isToday, isYesterday) =>
  message.message.includes('has started an audio call') ||
  message.message.includes('has ended an audio call') ? (
    <div className="px-8 text-primary text-sm mt-6 mb-4 flex items-center gap-4">
      <FontAwesomeIcon
        icon={faPhone}
        size="xl"
        className={`${
          message.message.includes('has started an audio call')
            ? 'text-green-600'
            : 'text-red-600'
        }`}
      />
      <div className="flex items-center gap-2">
        <span>{message.message}</span>
        <span className="font-bold text-xs">
          ({renderTime(message.timestamp, isToday, isYesterday)})
        </span>
      </div>
    </div>
  ) : message.message.includes('has started a video call') ||
    message.message.includes('has ended a video call') ? (
    <div className="px-8 text-primary text-sm mt-6 mb-4 flex items-center gap-4">
      <FontAwesomeIcon
        icon={faVideo}
        size="xl"
        className={`${
          message.message.includes('has started a video call')
            ? 'text-green-600'
            : 'text-red-600'
        }`}
      />
      <div className="flex items-center gap-2">
        <span>{message.message}</span>
        <span className="font-bold text-xs">
          ({renderTime(message.timestamp, isToday, isYesterday)})
        </span>
      </div>
    </div>
  ) : (
    <div
      key={message.timestamp}
      className={`px-6 chat w-full ${
        message.sender === userHandle ? 'chat-end' : 'chat-start'
      }`}
    >
      <div className="chat-image">
        <Profile handle={message.sender} />
      </div>
      <div className="chat-header text-primary font-bold text-md mt-2 mb-1">
        {members
          .filter((member) => member.handle === message.sender)
          .map((member) => `${member.firstName} ${member.lastName}`)}
      </div>
      <div
        className={`chat-bubble flex flex-col px-4 text-md ${
          message.sender === userHandle
            ? 'bg-primary text-secondary'
            : 'bg-primary bg-opacity-10 text-primary'
        }`}
      >
        {message.message}
        <span className="text-xs opacity-50 mr-2">
          {renderTime(message.timestamp, isToday, isYesterday)}
        </span>
      </div>
    </div>
  );

const renderMessages = (
  messages: Record<string, MessageType>,
  userHandle: string,
  members
) => {
  if (!messages || Object.keys(messages).length === 0) {
    return (
      <div className="text-center mt-3 text-primary font-bold">
        No messages yet...
      </div>
    );
  }

  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return Object.values(messages).map((message) => {
    const messageDate = new Date(message.timestamp);
    const isToday =
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();
    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    return renderChatBubble(message, userHandle, members, isToday, isYesterday);
  });
};

export default SingleChat;
