import { useEffect, useState } from 'react';
import { REACT_APP_OPEN_AI_API_KEY } from '../../common/open-ai-api';
import Chatbot from './Chatbot';

const OpenAI = () => {
  // Retrieve data from the .env file
  const API_KEY = REACT_APP_OPEN_AI_API_KEY;

  const [messages, setMessages] = useState([
    {
      role: 'system',
      content:
        "⭐ Welcome to ChatGenius 3000! I'm here to assist you with all your queries and make your day brighter. Ask me anything or just say hello! 🚀",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              ...messages,
              { role: 'user', content: 'This is a test!' },
            ],
            temperature: 0.7,
          }),
        }
      );

      console.log('response');
    };

    fetchData();
  }, [messages, isTyping]);

  const chatData = async (userMessage) => {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [...messages, { role: 'user', content: userMessage }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Oops! Something went wrong processing your request!');
      }

      const responseData = await response.json();
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: responseData.choices[0].message.content,
        },
      ]);
    } catch (error) {
      console.error('Error while fetching chat data:', error);
    }
  };

  return (
    <Chatbot
      messages={messages}
      setMessages={setMessages}
      chatData={chatData}
      setIsTyping={setIsTyping}
      isTyping={isTyping}
    />
  );
};

export default OpenAI;
