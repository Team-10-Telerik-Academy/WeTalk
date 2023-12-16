import { useState, useEffect } from "react";
import { db } from "../../config/firebase-config";
import { ref, get, set } from "@firebase/database";

const EditMessage = ({ message, chatId, messageId }) => {
  const [updated, setUpdated] = useState(message || "");
  const [existingMessageData, setExistingMessageData] = useState(null);

  useEffect(() => {
    const messageRef = ref(db, `chats/${chatId}/messages/${messageId}`);

    get(messageRef).then((snapshot) => {
      if (snapshot.exists()) {
        setExistingMessageData(snapshot.val());
      }
    });
  }, [chatId, messageId]);

  const modalId = `my_modal_${messageId}`;

  const handleUpdateMessage = () => {
    if (!existingMessageData) {
      console.error("Existing message data not found");
      return;
    }

    const messageRef = ref(db, `chats/${chatId}/messages/${messageId}`);
    const updatedMessageData = {
      ...existingMessageData,
      message: updated,
      edited: true,
      timestamp: Date.now(),
    };

    set(messageRef, updatedMessageData);
  };

  return (
    <>
      <button
        className="btn border-none h-10"
        onClick={() => document.getElementById(modalId)?.showModal()}
      >
        edit
      </button>
      <dialog
        id={modalId}
        className="modal align-center flex flex-row justify-center"
      >
        <div className="modal-box border-none overflow-x-wrap">
          <textarea
            className="border text-primary border-2 w-full h-full"
            value={updated}
            onChange={(e) => setUpdated(e.target.value)}
            style={{ resize: "none", height: "100px" }} // Set your desired fixed width
          />
          <div className="modal-action">
            <form method="dialog">
              <div className="flex justify-between">
                <button
                  className="btn text-primary mr-80"
                  onClick={handleUpdateMessage}
                >
                  edit
                </button>
                <button
                  className="btn text-primary ml-2"
                  onClick={() => setUpdated(message)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EditMessage;
