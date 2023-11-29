import { useContext, useEffect, useState } from "react";
import { getAllUsers } from "../../services/users.service";
import { IAppContext, IUserData } from "../../common/types";
import AppContext from "../../context/AuthContext";
import { CreateChat } from "../../services/chat.service";
import { v4 } from "uuid";

const CreateNewChat = () => {
  const [users, setUsers] = useState<IUserData[]>([]);
  const { userData } = useContext(AppContext) as IAppContext;
  const [members, setMembers] = useState<string[]>([]);
  const [chatName, setChatName] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData!);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [userData, users]);

  const handleCheckboxChange = (handle: string) => {
    setMembers((prevMembers) =>
      prevMembers.includes(handle)
        ? prevMembers.filter((member) => member !== handle)
        : [...prevMembers, handle]
    );
  };

  const handleCreateChat = () => {
    if (chatName) {
      const userHandle = userData?.handle;
      if (userHandle) {
        const updatedMembers = [...members, userHandle];

        if (updatedMembers.length > 0) {
          CreateChat(chatName, updatedMembers, v4());
        } else {
          console.error("At least two members are required.");
        }
      } else {
        console.error("User handle is not available.");
      }
    } else {
      console.error("Chat name is required.");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  const handleCancel = () => {
    setMembers([]);
    setChatName("");
  };

  return (
    <div>
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("Create_Chat_Modal") as HTMLDialogElement
          )?.showModal()
        }
      >
        +
      </button>
      <dialog id="Create_Chat_Modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-primary text-center">
            Create Chat
          </h3>
          <div>
            <span>chat name:</span>
            <input
              type="text"
              className="border text-sm p-2 w-full"
              onChange={handleNameChange}
              value={chatName}
            />
          </div>
          <div>
            <div>Users:</div>
            <div className="overflow-y-auto h-32">
              {users
                .filter((user) => user.handle !== userData?.handle)
                .map((user) => (
                  <div
                    key={user.handle}
                    className="flex items-center bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <label className="flex items-center w-full text-primary">
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
          </div>
          <div className="flex justify-between items-center">
            <button
              className="btn text-primary mt-6"
              onClick={handleCreateChat}
            >
              Create
            </button>
            <div className="modal-action">
              <form method="dialog">
                <div>
                  <button className="btn text-primary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreateNewChat;
