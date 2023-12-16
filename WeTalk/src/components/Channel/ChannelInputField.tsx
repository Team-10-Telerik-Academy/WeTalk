import { useState } from "react";
import { sendMessage, sendFile } from "../../services/channel.service";
import { ref, update } from "@firebase/database";
import { db } from "../../config/firebase-config";
// import ChannelSendFile from "./ChannelSendFile";
import ChannelGiphy from "./ChannelGiphy";
import EmojiInput from "../SingleChat/EmojiInput";
import ChannelSendFile from "./ChannelSendFile";

interface InputFieldProps {
  handle: string;
  channelId: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (value: string) => void;
  members: string[];
}

const ChannelInputField: React.FC<InputFieldProps> = ({
  handle,
  channelId,
  members,
  setInputValue,
  handleInputChange,
}) => {
  // console.log(members);

  const filteredMembers = members.filter((member) => member !== handle);
  console.log(handle);

  const handleSendMessage = async (message: string) => {
    try {
      // Set typing status to false before sending the message
      update(ref(db, `channels/${channelId}/typingStatus`), {
        [handle]: false,
      });
      console.log("filtered", filteredMembers);

      // Send the message
      await sendMessage(channelId, message, handle, filteredMembers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveFile = async (file: File) => {
    try {
      await sendFile(channelId, file, handle, filteredMembers);
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
      <ChannelGiphy channelId={channelId} handle={handle} members={members} />
      <ChannelSendFile onSave={handleSaveFile} channelId={channelId} />
      <EmojiInput onSubmit={handleSendMessage} handleChange={handleChange} />
    </div>
  );
};

export default ChannelInputField;

