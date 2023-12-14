import { useContext, useRef } from 'react';
// import Profile from '../Profile/Profile';
import AppContext from '../../context/AuthContext';
import { IAppContext } from '../../common/types';
import Typewriter from './Typewriter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowDown,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

const Chatbot = ({
  messages,
  setMessages,
  chatData,
  setIsTyping,
  isTyping,
}: {
  messages: string[];
  setMessages: (messages) => void;
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (messageContent: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: messageContent },
    ]);
    // invoke chatData
    chatData(messageContent);
    setIsTyping(true);
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScrollDown = () => {
    scrollToBottom();
  };

  const { userData } = useContext(AppContext) as IAppContext;

  return (
    <div className="flex flex-col items-center justify-center text-center py-4 mx-auto h-screen">
      <div
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto justify-start items-center px-4 xl:px-96 mb-10 ${
          messages.length > 1 ? 'flex-grow' : 'flex'
        }`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center mb-12"
          >
            <div className="text-xl">
              {message.role === 'user' ? (
                <h3 className=" font-bold text-primary">
                  {userData?.firstName} {userData?.lastName}
                </h3>
              ) : (
                <h3 className="font-bold text-primary">ChatGenius 3000</h3>
              )}
            </div>
            <div className="py-1">
              <div className="text-primary">
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <Typewriter text={message.content} speed={30} />
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <p className="animate-pulse text-primary text-opacity-70">
            ChatGenius 3000 is typing...
          </p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.target.input.value;
          if (input.trim() !== '') {
            handleSendMessage(input);
            e.target.reset();
          }
        }}
        aria-label="Chat Input Form"
        className="flex items-center justify-between gap-2 rounded fixed bottom-4 z-10"
      >
        <input
          type="text"
          name="input"
          placeholder="Type your message..."
          className="rounded-xl p-3 border-2 w-[700px]"
        />
        <button
          type="submit"
          className="bg-blue-500 p-3 rounded font-bold text-secondary hover:bg-blue-600 hover:scale-110"
        >
          <FontAwesomeIcon icon={faPaperPlane} size="xl" />
        </button>
        <button
          onClick={handleScrollDown}
          className="bg-blue-500 p-3 rounded font-bold text-secondary hover:bg-blue-600 hover:scale-110"
        >
          <FontAwesomeIcon icon={faCircleArrowDown} size="xl" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
