import EditMessage from "./EditMessage";
import { useEffect, useState } from "react";
import { ref, remove } from "@firebase/database";
import { db } from "../../config/firebase-config";

type MessageSettingsProps = {
  chatId: string;
  messageId: string;
  message: {};
  onEdit: (messageId: string, editedMessage: string, editMode: boolean) => void;
  type: string;
};

const MessageSettings: React.FC<MessageSettingsProps> = ({
  chatId,
  messageId,
  message,
  onEdit,
  type,
}) => {
  const handleMessageDelete = () => {
    const messageRef = ref(db, `chats/${chatId}/messages/${messageId}`);
    remove(messageRef);
  };

  const handleEdit = (
    editedMessage: string,
    messageId: string,
    chatId: string
  ) => {
    onEdit(editedMessage, messageId, chatId);
  };

  return (
    <details className="dropdown dropdown-left border-none dropdown-middle">
      <summary className="mx-1 mt-2 mr-6 btn btn-sm h-0.1 w-1 border-none bg-secondary shadow-inner rounded-full text-xs text-primary">
        ...
      </summary>
      <ul className="p-2 shadow menu dropdown-content w-max z-[1] rounded-box border-none bg-primary text-secondary">
        {type !== "file" && (
          <li>
            <EditMessage
              chatId={chatId}
              messageId={messageId}
              message={message}
              onEdit={handleEdit}
            />
          </li>
        )}
        <li>
          <button onClick={handleMessageDelete}>delete</button>
        </li>
      </ul>
    </details>
  );
};

export default MessageSettings;
