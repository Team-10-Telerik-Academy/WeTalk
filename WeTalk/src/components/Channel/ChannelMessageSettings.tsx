
import { ref, remove } from "@firebase/database";
import { db } from "../../config/firebase-config";
import ChannelEditMessage from "./ChannelEditMessage";

type ChannelMessageSettingsProps = {
  channelId: string;
  messageId: string;
  message: {};
  onEdit: (messageId: string, editedMessage: string, editMode: boolean) => void;
  type: string;
};

const ChannelMessageSettings: React.FC<MessageSettingsProps> = ({
  channelId,
  messageId,
  message,
  onEdit,
  type,
}) => {
  const handleMessageDelete = () => {
    const messageRef = ref(db, `channels/${channelId}/messages/${messageId}`);
    remove(messageRef);
  };

  const handleEdit = (
    editedMessage: string,
    messageId: string,
    channelId: string
  ) => {
    onEdit(editedMessage, messageId, channelId);
  };

  return (
    <details className="dropdown dropdown-left border-none dropdown-middle">
      <summary className="mx-1 mt-2 mr-6 btn btn-sm h-0.1 w-1 border-none bg-secondary shadow-inner rounded-full text-xs text-primary">
        ...
      </summary>
      <ul className="p-2 shadow menu dropdown-content w-max z-[1] rounded-box border-none bg-primary text-secondary">
        {type !== "file" && (
          <li>
            <ChannelEditMessage
              channelId={channelId}
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

export default ChannelMessageSettings;
