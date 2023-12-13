import { useState } from "react";
import { sendMessage, sendFile } from "../../services/channel.service";
import { ref, update } from "@firebase/database";
import { db } from "../../config/firebase-config";
// import ChannelSendFile from "./ChannelSendFile";
import ChannelGiphy from "./ChannelGiphy";
import EmojiInput from "../SingleChat/EmojiInput";

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
      {/* <ChannelSendFile onSave={handleSaveFile} channelId={channelId} /> */}
      <EmojiInput onSubmit={handleSendMessage} handleChange={handleChange} />
    </div>
  );
};

export default ChannelInputField;

// const ChannelInputField = ({ handle, channelId }) => {
//   const [message, setMessage] = useState("");

//   const handleInputChange = (event) => {
//     setMessage(event.target.value);
//   };

//   const handleSendMessage = async (event) => {
//     event.preventDefault();

//     try {
//       await sendChannelMessage(channelId, message, handle);
//       setMessage("");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex justify-center">
//       <form
//         className="flex w-full max-w-screen-md"
//         onSubmit={handleSendMessage}
//       >
//         <input
//           type="text"
//           placeholder="Send Message"
//           className="w-full border rounded-xl text-start p-2 h-14 my-4"
//           value={message}
//           onChange={handleInputChange}
//         />
//         <button
//           type="submit"
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-xl my-4"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChannelInputField;
