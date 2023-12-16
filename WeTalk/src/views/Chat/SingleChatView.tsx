import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChatMessages } from '../../services/chat.service';
import SingleChat from '../../components/SingleChat/SingleChat';

const SingleChatView = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (chatId) {
          const chatMessages = await getChatMessages(chatId);
          setMessages(chatMessages);
          console.log('fetched chat messages');
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
    <div className="overflow-y w-full ml-2 mr-4 drop-shadow-lg">
      <SingleChat chatId={chatId!} messages={messages} />
    </div>
  );
};

export default SingleChatView;
