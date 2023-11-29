import { useState } from "react";
import { SendMessage } from "../../services/chat.service";

interface InputFieldProps {
  handle: string;
  chatId: string;
}

const InputField: React.FC<InputFieldProps> = ({ handle, chatId }) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await SendMessage(chatId, message, handle);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        className="flex w-full max-w-screen-md"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          placeholder="Send Message"
          className="w-full border rounded-xl text-start p-2 h-14 my-4"
          value={message}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-xl my-4"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default InputField;
