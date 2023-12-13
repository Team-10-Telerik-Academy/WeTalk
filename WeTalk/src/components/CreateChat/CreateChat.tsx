import { useContext, useEffect, useState } from "react";
import { getAllUsers } from "../../services/users.service";
import { IAppContext, IUserData } from "../../common/types";
import AppContext from "../../context/AuthContext";
import {
  CreateChat,
  addRoomID,
  findChatByMembers,
} from "../../services/chat.service";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ORGANIZATION_ID, API_KEY, BASE_URL } from "../../common/dyte-api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateNewChat = () => {
  const [users, setUsers] = useState<IUserData[]>([]);
  const { userData } = useContext(AppContext) as IAppContext;
  const [members, setMembers] = useState<string[]>([]);
  const [chatName, setChatName] = useState<string>("");

  useEffect(() => {
    try {
      const usersCallback = (usersData: IUserData[]) => {
        setUsers(usersData);
        console.log(usersData);
      };

      const unsubscribe = getAllUsers(usersCallback);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }, []);

  const handleCheckboxChange = (handle, firstName, lastName) => {
    setMembers((prevMembers) => {
      const existingMemberIndex = prevMembers.findIndex(
        (member) => member.handle === handle
      );

      if (existingMemberIndex !== -1) {
        // Member already exists, remove it
        const updatedMembers = [...prevMembers];
        updatedMembers.splice(existingMemberIndex, 1);
        return updatedMembers;
      } else {
        // Member doesn't exist, add it
        return [
          ...prevMembers,
          { handle: handle, firstName: firstName, lastName: lastName },
        ];
      }
    });
  };

  const navigate = useNavigate();

  const handleCreateChat = async () => {
    try {
      const user = {
        handle: userData?.handle,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
      };

      if (!user) {
        console.error("User data is not available.");
        return;
      }

      const updatedMembers = [...members, user];
      console.log("updated members:", updatedMembers);

      if (updatedMembers.length < 2) {
        console.error("At least two members are required.");
        return;
      }

      if (updatedMembers.length > 2 && !chatName) {
        console.error("Chat name is required.");
        return;
      }

      try {
        const existingChat = await findChatByMembers(updatedMembers);

        if (existingChat) {
          navigate(`${existingChat.chatId}`);
        } else {
          // No existing chat found, create a new chat
          const newChat = await CreateChat(chatName, updatedMembers, v4());

          const { chatId } = newChat;

          const encodedString = btoa(`${ORGANIZATION_ID}:${API_KEY}`);

          const dyteRoomCreate = {
            method: "POST",
            url: `${BASE_URL}/meetings`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${encodedString}`,
              "Access-Control-Allow-Origin": "*",
            },
            data: { title: chatName },
          };
          navigate(`${chatId}`);

          try {
            const response = await axios.request(dyteRoomCreate);
            console.log("Dyte Room Created:", response);
            const dyteID = response.data.data.id;

            addRoomID(chatId, dyteID);
            navigate(`${chatId}`);
          } catch (error) {
            console.error("Error creating Dyte room:", error);
            console.error("Response data:", error.response?.data);
            // Additional logging for debugging
            console.error("Dyte Room Creation failed:", error.message);
          }
        }
      } catch (error) {
        console.error("Error checking existing chat:", error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
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
        onClick={() =>
          (
            document.getElementById("Create_Chat_Modal") as HTMLDialogElement
          )?.showModal()
        }
        className="inline-flex items-center gap-2 bg-accent text-primary text-xs uppercase p-2 lg:px-3 lg:py-2 rounded hover:bg-primary hover:text-secondary"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span className="tracking-tight text-xs lg:text-sm">Create</span>
      </button>
      <dialog id="Create_Chat_Modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-black text-center">
            Create Chat
          </h3>
          <div>
            {members.length > 1 && (
              <div>
                <span className="text-black">chat name:</span>
                <input
                  type="text"
                  className="border text-sm p-2 w-full text-black"
                  onChange={handleNameChange}
                  value={chatName}
                />
              </div>
            )}
          </div>
          <div>
            <div className="text-black">Users:</div>
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
                        checked={members.some(
                          (member) => member.handle === user.handle
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            user.handle,
                            user.firstName,
                            user.lastName
                          )
                        }
                        className="mr-2"
                      />
                      <div className="text-black">
                        {user.firstName} {user.lastName} ({user.handle})
                      </div>
                    </label>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button className="btn text-black mt-6" onClick={handleCreateChat}>
              Create
            </button>
            <div className="modal-action">
              <form method="dialog">
                <div>
                  <button className="btn text-black" onClick={handleCancel}>
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
