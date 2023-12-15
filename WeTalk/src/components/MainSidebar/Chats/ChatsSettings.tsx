import { ref, remove, set, get, update } from "@firebase/database";
import { db } from "../../../config/firebase-config";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AuthContext";
import { IAppContext, IUserData } from "../../../common/types";
import UploadGroupChatPhoto from "./UploadGroupChatPhoto";
import { getAllUsers } from "../../../services/users.service";
import { FaInfoCircle } from "react-icons/fa";
import Media from "./Media";
import { useNavigate } from "react-router";

const ChatSettings = ({ chat, chatId }) => {
  const modalId = `my_modal_${chatId}`;
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(chat.chatName || "");
  const { userData } = useContext(AppContext) as IAppContext;
  const [users, setUsers] = useState<IUserData[]>([]);
  const [view, setView] = useState("main"); // "main", "addMember", "uploadPhoto"
  const [members, setMembers] = useState<string[]>([]);
  const [chatMembers, setChatMembers] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        getAllUsers((usersData) => {
          setUsers(usersData);
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [userData, users]);

  useEffect(() => {
    const members = [...chat.members];
    setChatMembers(members);
    console.log("chat members:", chatMembers);
    console.log("users:", users);
  }, [chat.members]);

  useEffect(() => {
    console.log("Updated members:", members);
  }, [members]);

  const handleCheckboxChange = (handle: string) => {
    setMembers((prevMembers) => {
      if (prevMembers.includes(handle)) {
        return prevMembers.filter((member) => member !== handle);
      } else {
        return [...prevMembers, handle];
      }
    });
  };

  const handleChatDelete = () => {
    const chatRef = ref(db, `chats/${chatId}`);
    remove(chatRef);
    navigate("../");
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedName(chat.chatName);
  };

  const handleSave = () => {
    const chatName = chatId;
    const dbRef = ref(db, "chats");

    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const chats = snapshot.val();
        const chatDataRef = ref(db, `chats/${chatName}`);
        set(chatDataRef, {
          ...chats[chatName!],
          chatName: editedName,
        });
      }
    });
    setEditMode(false);
  };

  const handleLeaveGroup = () => {
    const chatName = chatId;
    const userHandle = userData?.handle;
    const chatRef = ref(db, `chats/${chatName}`);

    get(chatRef).then((snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();

        const updatedMembers = chatData.members.filter(
          (member) => member.handle !== userHandle
        );

        set(chatRef, {
          ...chatData,
          members: updatedMembers,
        });
        navigate("../");
      }
    });
  };

  const handleCancel = () => {
    setEditedName(chat.chatName);
    setEditMode(false);
  };

  const handleChangeView = (newView) => {
    setView(newView);
  };

  const [GroupAvatarUrl, setGroupAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const userHandle = userData?.handle;
    console.log(userHandle);
    console.log(GroupAvatarUrl);

    if (userHandle && GroupAvatarUrl !== null) {
      const dbRef = ref(db, `chats/${chat.chatId}`);

      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const chats = snapshot.val();
          set(dbRef, {
            ...chats,
            imgUrl: GroupAvatarUrl,
          });
        }
      });
    }
  }, [GroupAvatarUrl]);

  const handleAddMembers = () => {
    const chatRef = ref(db, `chats/${chat.chatId}`);

    get(chatRef).then((snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();

        const updatedMembers = [...chatData.members, ...members];

        set(chatRef, {
          ...chatData,
          members: updatedMembers,
        });

        setMembers([]);

        console.log("Members added:", members);
      }
    });
  };

  return (
    <div>
      <button
        className="border-none focus:outline-none text-2xl"
        style={{
          width: "25px",
          height: "25px",
        }}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(modalId)?.showModal();
        }}
      >
        <FaInfoCircle />
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box h-max">
          <div className="flex flex-col items-center">
            {view === "main" && (
              <div>
                {chat.members.length > 2 && (
                  <div>
                    {chat.chatName && (
                      <div className="items-center w-64">
                        {editMode ? (
                          <div className="flex flex-col items-center justify-center align-center text-center">
                            <input
                              className="border text-xl font-bold text-center"
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                            />
                            <div className="flex">
                              <button
                                className="text-sm btn w-14"
                                onClick={handleSave}
                              >
                                Save
                              </button>
                              <button
                                className="text-sm btn w-14"
                                onClick={handleCancel}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-between w-64">
                            <p className="text-xl font-bold">{chat.chatName}</p>
                            <button className="text-sm" onClick={handleEdit}>
                              Edit chat name
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col w-64 item-center">
                      <button
                        className="btn bg-success/70 hover:bg-success my-0.5 shadow-inner shadow-success"
                        onClick={() => handleChangeView("addMember")}
                      >
                        add member/s
                      </button>
                      <button
                        className="btn bg-primary/10 my-0.5 shadow-inner shadow-secondary  text-black"
                        onClick={() => handleChangeView("uploadPhoto")}
                      >
                        upload photo
                      </button>
                      <button
                        className="btn bg-error/70 hover:bg-error w-64 my-0.5 shadow-inner shadow-error"
                        onClick={handleLeaveGroup}
                      >
                        leave group
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <button
                    className="btn bg-primary/10 my-0.5 shadow-inner shadow-secondary text-black"
                    onClick={() => handleChangeView("media")}
                  >
                    media
                  </button>
                  <button
                    className="btn bg-error/70 hover:bg-error w-64 my-0.5 shadow-inner shadow-error"
                    onClick={handleChatDelete}
                  >
                    delete chat
                  </button>
                </div>
              </div>
            )}

            {view === "addMember" && (
              <div className="w-64">
                <div className="mb-3">
                  <p className="font-bold underline text-black">Members:</p>
                  {chatMembers.map((member) => (
                    <p className="border-b font-bold text-lg text-black">
                      {member.firstName} {member.lastName} ({member.handle})
                    </p>
                  ))}
                </div>
                <div className="overflow-y-auto h-64">
                  <div>
                    <p className="text-black">add Member:</p>
                    <input
                      type="text"
                      className="border w-full mb-2 rounded-lg pl-0.5"
                    />
                  </div>
                  {users
                    .filter(
                      (user) =>
                        user.handle !== userData?.handle &&
                        !chatMembers.some(
                          (member) => member.handle === user.handle
                        )
                    )
                    .map((user) => (
                      <div
                        key={user.handle}
                        className="flex items-center bg-gray-100 p-2 hover:bg-gray-200"
                      >
                        <label className="flex items-center w-full text-black">
                          <input
                            type="checkbox"
                            checked={members.includes(user.handle)}
                            onChange={() => handleCheckboxChange(user.handle)}
                            className="mr-2"
                          />
                          {user.firstName} {user.lastName} ({user.handle})
                        </label>
                      </div>
                    ))}
                </div>
                <div className="flex justify-between">
                  <button className="btn text-black" onClick={handleAddMembers}>
                    Add
                  </button>
                  <button
                    className="btn text-black"
                    onClick={() => handleChangeView("main")}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            {view === "media" && (
              <div className="w-64">
                <div className="mb-3">
                  <p className="font-bold underline text-center text-black">
                    Media
                  </p>
                </div>

                <div className="overflow-y-auto h-64 overflow-x-hidden w-64">
                  <Media chatId={chatId} />
                </div>
                <div className="flex justify-center">
                  <button
                    className="btn text-black"
                    onClick={() => handleChangeView("main")}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {view === "uploadPhoto" && (
              <div>
                <UploadGroupChatPhoto
                  chat={chat}
                  setGroupAvatarUrl={setGroupAvatarUrl}
                />
                <div className="flex justify-center">
                  <button
                    className="btn mt-1 text-black"
                    onClick={() => handleChangeView("main")}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ChatSettings;
