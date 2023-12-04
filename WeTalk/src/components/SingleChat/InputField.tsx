import { ref, update } from 'firebase/database';
import { SendMessage } from '../../services/chat.service';
import EmojiInput from './EmojiInput';
import { db } from '../../config/firebase-config';

interface InputFieldProps {
  handle: string;
  chatId: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  handle,
  chatId,
  setInputValue,
  handleInputChange,
}) => {
  const handleSendMessage = async (message: string) => {
    try {
      // Set typing status to false before sending the message
      update(ref(db, `chats/${chatId}/typingStatus`), {
        [handle]: false,
      });

      // Send the message
      await SendMessage(chatId, message, handle);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    handleInputChange(value);
  };

  return (
    <div className="flex">
      <EmojiInput onSubmit={handleSendMessage} handleChange={handleChange} />
    </div>
  );
};

export default InputField;
