import { ref, update } from "firebase/database";
import { SendMessage, sendFile } from "../../services/chat.service";
import EmojiInput from "./EmojiInput";
import { db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import Giphy from "./Giphy";
import SendFile from "./SendFile";

interface InputFieldProps {
  handle: string;
  chatId: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (value: string) => void;
  members: string[];
}

const InputField: React.FC<InputFieldProps> = ({
  handle,
  chatId,
  members,
  setInputValue,
  handleInputChange,
}) => {
  // console.log(members);

  // const handles = members.map((member) => member.handle);
  // console.log(handles);

  const filteredMembers = members.filter((member) => member !== handle);
  console.log(handle);

  const handleSendMessage = async (message: string) => {
    try {
      // Set typing status to false before sending the message
      update(ref(db, `chats/${chatId}/typingStatus`), {
        [handle]: false,
      });
      console.log("filtered", filteredMembers);

      // Send the message
      await SendMessage(chatId, message, handle, filteredMembers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveFile = async (file: File) => {
    try {
      await sendFile(chatId, file, handle, filteredMembers);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    handleInputChange(value);
  };

  return (
    <div className="flex items-center">
      <Giphy chatId={chatId} handle={handle} members={members} />
      <SendFile onSave={handleSaveFile} chatId={chatId} />
      <EmojiInput onSubmit={handleSendMessage} handleChange={handleChange} />
    </div>
  );
};

export default InputField;
