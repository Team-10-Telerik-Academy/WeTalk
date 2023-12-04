import { useContext, useEffect, useState, useRef } from 'react';
import AppContext from '../../context/AuthContext';
import InputField from './InputField';
import { IAppContext } from '../../common/types';
import Profile from '../Profile/Profile';
import { Link, useNavigate } from 'react-router-dom';
import CurrentRoom from '../Meeting/CurrentRoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
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
  roomId: string;
  roomStatus: string;
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
  const [isCallButtonClicked, setIsCallButtonClicked] = useState(false);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // const handleInputKeyDown = () => {
  //   // Set typing status to true when a key is pressed
  //   setTypingStatus((prevStatus) => ({
  //     ...prevStatus,
  //     [userData?.handle!]: true,
  //   }));

  //   console.log(typingStatus);

  //   // Update typing status in Firebase
  //   update(ref(db, `chats/${chatId}/typingStatus`), {
  //     [userData?.handle!]: true,
  //   });
  // };

  // const handleInputKeyUp = () => {
  //   // Set typing status to false when a key is released
  //   setTypingStatus((prevStatus) => ({
  //     ...prevStatus,
  //     [userData?.handle!]: false,
  //   }));

  //   console.log(typingStatus);

  //   // Update typing status in Firebase
  //   update(ref(db, `chats/${chatId}/typingStatus`), {
  //     [userData?.handle!]: false,
  //   });
  // };

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
        console.log('Messages updated:', messagesData);
        setChat((prevChat) => ({
          ...prevChat!,
          messages: messagesData,
        }));
      },
      (typingStatus: Record<string, boolean>) => {
        console.log('Typing status updated:', typingStatus);
        setTypingStatus(typingStatus);
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

  useEffect(() => {
    // Add a class to the body to hide the main scrollbar
    document.body.style.overflow = 'hidden';

    console.log('Scrollbar');

    return () => {
      // Remove the class when the component is unmounted
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleCallButtonClick = () => {
    if (chat?.roomId) {
      console.log('Room opened');
      setIsCallButtonClicked(true);
      navigate(`/home/chats/${chatId}/${chat?.roomId}`);
    }
  };

  if (isCallButtonClicked) {
    return <CurrentRoom setIsCallButtonClicked={setIsCallButtonClicked} />;
  }

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex items-center justify-between py-2 shadow border-b">
        <div className="flex-grow">
          <h1 className="h-12 flex items-center justify-center text-2xl font-bold text-primary ml-14">
            {chat?.members.length > 2
              ? chat?.chatName
              : chat?.members[0]?.handle !== userData?.handle
              ? `${chat?.members[0]?.firstName} ${chat?.members[0]?.lastName} (${chat?.members[0]?.handle})`
              : `${chat?.members[1]?.firstName} ${chat?.members[1]?.lastName} (${chat?.members[1]?.handle})`}
          </h1>
        </div>
        <div className="flex justify-between items-center gap-4">
          <Link to={chat?.roomId ? `${chat?.roomId}` : ''}>
            <button
              className="bg-blue-500 text-secondary px-4 py-2 rounded"
              onClick={handleCallButtonClick}
            >
              <FontAwesomeIcon icon={faVideo} />
            </button>
          </Link>
          <p className="text-primary mr-4">settings</p>
        </div>
      </div>
      {/* <div className="h-0.5 w-full bg-accent"></div> */}

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
          <h1 className="text-center mt-3 text-primary r">
            This is the start of your conversation with
            <h2 className="font-bold">
              {chat?.members.length > 2
                ? chat?.chatName
                : chat?.members[0]?.handle !== userData?.handle
                ? `${chat?.members[0]?.firstName} ${chat?.members[0]?.lastName}`
                : `${chat?.members[1]?.firstName} ${chat?.members[1]?.lastName}`}
            </h2>
          </h1>
        ) : null}
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

// const renderMessages = (
//   messages: Record<string, MessageType>,
//   userHandle: string,
//   members
// ) => {
//   if (!messages || Object.keys(messages).length === 0) {
//     return <div className="text-center mt-3 text-primary">No messages yet</div>;
//   }

//   const now = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);

//   return Object.values(messages).map((message) => {
//     const messageDate = new Date(message.timestamp);

//     if (
//       messageDate.getDate() === now.getDate() &&
//       messageDate.getMonth() === now.getMonth() &&
//       messageDate.getFullYear() === now.getFullYear()
//     ) {
//       return (
//         <div
//           key={message.timestamp}
//           className={`px-4 py-2 chat w-full ${
//             message.sender === userHandle ? 'chat-end' : 'chat-start'
//           }`}
//         >
//           <div className="chat-image">
//             <Profile handle={message.sender} />
//           </div>
//           <div className="chat-header text-primary font-bold text-md m-2 mb-1">
//             {members
//               .filter((member) => member.handle === message.sender)
//               .map((member) => `${member.firstName} ${member.lastName}`)}
//           </div>
//           <div
//             className={`chat-bubble flex flex-col px-4 text-md ${
//               message.sender === userHandle
//                 ? 'bg-primary text-secondary'
//                 : 'bg-primary bg-opacity-10 text-primary'
//             }`}
//           >
//             {message.message}
//             <time className="text-xs opacity-50 mr-2">
//               Today at{' '}
//               {new Date(message.timestamp).toLocaleString('en-US', {
//                 hour: 'numeric',
//                 minute: 'numeric',
//               })}
//             </time>
//           </div>
//         </div>
//       );
//     } else if (
//       messageDate.getDate() === yesterday.getDate() &&
//       messageDate.getMonth() === yesterday.getMonth() &&
//       messageDate.getFullYear() === yesterday.getFullYear()
//     ) {
//       return (
//         <div
//           key={message.timestamp}
//           className={`px-4 chat w-full ${
//             message.sender === userHandle ? 'chat-end' : 'chat-start'
//           }`}
//         >
//           <div className="chat-image">
//             <Profile handle={message.sender} />
//           </div>
//           <div className="chat-header text-primary font-bold text-md mt-2 mb-1">
//             {members
//               .filter((member) => member.handle === message.sender)
//               .map((member) => `${member.firstName} ${member.lastName}`)}
//           </div>
//           <div
//             className={`chat-bubble flex flex-col px-4 text-md ${
//               message.sender === userHandle
//                 ? 'bg-primary text-secondary'
//                 : 'bg-primary bg-opacity-10 text-primary'
//             }`}
//           >
//             {message.message}
//             <time className="text-xs opacity-50 mr-2">
//               Yesterday at{' '}
//               {new Date(message.timestamp).toLocaleString('en-US', {
//                 hour: 'numeric',
//                 minute: 'numeric',
//               })}
//             </time>
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div
//           key={message.timestamp}
//           className={`px-4 chat w-full ${
//             message.sender === userHandle ? 'chat-start' : 'chat-end'
//           }`}
//         >
//           <div className="chat-image">
//             <Profile handle={message.sender} />
//           </div>
//           <div className="chat-header text-primary font-bold text-md mt-2 mb-1">
//             {members
//               .filter((member) => member.handle === message.sender)
//               .map((member) => `${member.firstName} ${member.lastName}`)}
//           </div>
//           <div
//             className={`chat-bubble flex flex-col px-4 text-md ${
//               message.sender === userHandle
//                 ? 'bg-primary text-secondary'
//                 : 'bg-primary bg-opacity-10 text-primary'
//             }`}
//           >
//             {message.message}
//             <time className="text-xs opacity-50 mr-2">
//               {new Date(message.timestamp).toLocaleString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//                 hour: 'numeric',
//                 minute: 'numeric',
//               })}
//             </time>
//           </div>
//         </div>
//       );
//     }
//   });
// };

const renderTime = (timestamp) => (
  <time className="text-xs opacity-50 mr-2">{timestamp}</time>
);

const renderChatBubble = (
  message,
  userHandle,
  members,
  isToday,
  isYesterday
) => (
  <div
    key={message.timestamp}
    className={`px-4 chat w-full ${
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
      {renderTime(
        isToday
          ? `Today at ${new Date(message.timestamp).toLocaleTimeString(
              'en-US',
              { hour: 'numeric', minute: 'numeric' }
            )}`
          : isYesterday
          ? `Yesterday at ${new Date(message.timestamp).toLocaleTimeString(
              'en-US',
              { hour: 'numeric', minute: 'numeric' }
            )}`
          : new Date(message.timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })
      )}
    </div>
  </div>
);

const renderMessages = (
  messages: Record<string, MessageType>,
  userHandle: string,
  members
) => {
  if (!messages || Object.keys(messages).length === 0) {
    return <div className="text-center mt-3 text-primary">No messages yet</div>;
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
