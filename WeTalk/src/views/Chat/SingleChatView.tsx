import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChatMessages } from '../../services/chat.service';
import SingleChat from '../../components/SingleChat/SingleChat';
import CurrentRoom from '../../components/Meeting/CurrentRoom';

const SingleChatView = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (chatId) {
          const chatMessages = await getChatMessages(chatId);
          setMessages(chatMessages);
          console.log(chatMessages);
        } else {
          console.error('Chat ID is not available.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [chatId]);

  return (
    <div className="overflow-y w-full">
      <SingleChat chatId={chatId!} messages={messages} />
    </div>
    // <div className="flex w-full">
    // <div className="flex-none"><NavigationSidebarView /></div>
    // </div>
  );
};

export default SingleChatView;
