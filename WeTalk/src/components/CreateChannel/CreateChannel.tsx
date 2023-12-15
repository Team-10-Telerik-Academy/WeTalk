import { useContext, useEffect, useState } from "react";
import { getAllUsers, getUserByHandle } from "../../services/users.service";
import { IAppContext } from "../../common/types";
import AppContext from "../../context/AuthContext";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MAX_CHANNEL_TITLE_LENGTH,
  MIN_CHANNEL_TITLE_LENGTH,
} from "../../common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  addRoomIDChannel,
  createChannel,
  deleteChannel,
} from "../../services/channel.service";
import { API_KEY, BASE_URL, ORGANIZATION_ID } from "../../common/dyte-api";
import { useNavigate } from "react-router";
import axios from "axios";

interface IUserData {
  firstName: string;
  lastName: string;
  handle: string;
}
interface CreateChannelProps {
  teamName: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  owner: any; // Replace 'any' with the actual type
  teamData: any; // Replace 'any' with the actual type
}
const CreateChannel: React.FC<CreateChannelProps> = ({
  teamName,
  isModalOpen,
  setIsModalOpen,
  owner,
  teamData,
}) => {
  const [users, setUsers] = useState<IUserData[]>([]);
  const { userData } = useContext(AppContext) as IAppContext;
  const [channelMembers, setChannelMembers] = useState<string[]>([]);
  const [channelName, setChannelName] = useState<string>("");
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();

  const handleCheckboxChange = (
    handle: string,
    firstName: string,
    lastName: string
  ) => {
    setChannelMembers((prevMembers) =>
      prevMembers.some((member) => member.handle === handle)
        ? prevMembers.filter((member: string) => member.handle !== handle)
        : [...prevMembers, { handle, firstName, lastName }]
    );
  };

  // const handleCheckboxChange = (handle, firstName, lastName) => {
  //   setMembers((prevMembers) => {
  //     const existingMemberIndex = prevMembers.findIndex(
  //       (member) => member.handle === handle
  //     );
  //     console.log(members);
  //     if (existingMemberIndex !== -1) {
  //       // Member already exists, remove it
  //       const updatedMembers = [...prevMembers];
  //       updatedMembers.splice(existingMemberIndex, 1);
  //       return updatedMembers;
  //     } else {
  //       // Member doesn't exist, add it
  //       return [
  //         ...prevMembers,
  //         { handle: handle, firstName: firstName, lastName: lastName },
  //       ];
  //     }
  //   });
  // };

  const handleCreateChannel = async (
    channelName: string,
    channelMembers: string[]
  ) => {
    if (!channelName) {
      toast.warning("Channel Name is required!", {
        autoClose: 3000,
        className: "font-bold",
      });
      return;
    }
    if (
      channelName &&
      (channelName.length < MIN_CHANNEL_TITLE_LENGTH ||
        channelName.length > MAX_CHANNEL_TITLE_LENGTH)
    ) {
      toast.warning(
        `Channel Name must contain between ${MIN_CHANNEL_TITLE_LENGTH} and ${MAX_CHANNEL_TITLE_LENGTH} characters!`,
        {
          autoClose: 3000,
          className: "font-bold",
        }
      );
      return;
    }
    try {
      if (channelName) {
        const user = {
          handle: userData?.handle,
          firstName: userData?.firstName,
          lastName: userData?.lastName,
        };
        if (owner) {
          const updatedMembers = [...channelMembers];
          const newChannel = await createChannel(
            channelName,
            updatedMembers,
            v4(),
            teamName,
            owner
          );

          const { channelId } = newChannel;

          const encodedString = btoa(`${ORGANIZATION_ID}:${API_KEY}`);

          const dyteRoomCreate = {
            method: "POST",
            url: `${BASE_URL}/meetings`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${encodedString}`,
              "Access-Control-Allow-Origin": "*",
            },
            data: { title: channelName },
          };
          navigate(`${channelId}`);

          try {
            const response = await axios.request(dyteRoomCreate);
            console.log("Dyte Room Created:", response);
            const dyteID = response.data.data.id;

            addRoomIDChannel(channelId, dyteID);
            navigate(`${channelId}`);
          } catch (error) {
            console.error("Error creating Dyte room:", error);
            console.error("Response data:", error.response?.data);
            // Additional logging for debugging
            console.error("Dyte Room Creation failed:", error.message);
          }
        }
      }
    } catch (error) {
      console.error("Error creating team", error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChannelName("");
    setSelectAll(false);
  };
  const handleCreateButtonClick = () => {
    handleCreateChannel(channelName, channelMembers);
    closeModal();
    // console.log(userData);
  };

  const handleDeleteChannel = async (channelId: string) => {
    try {
      await deleteChannel(channelId);
    } catch (error) {
      console.error("Error deleting team", error);
    }
  };

  // const handleSelectAll = () => {
  //   // const newUsers = users.map((user) => ({
  //   //   handle: user.handle,
  //   //   firstName: user.firstName,
  //   //   lastName: user.lastName
  //   // }))
  //   setSelectAll(!selectAll);
  //   setChannelMembers((prevMembers) =>
  //     selectAll
  //       ? prevMembers.filter(
  //           (member) =>
  //             !teamData.members.map((member) =>
  //               member.handle.includes(member.handle)
  //             ) && member.handle !== userData.handle
  //         )
  //       : [...prevMembers, ...channelMembers]
  //   );
  // };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setChannelMembers((prevMembers) =>
      selectAll
        ? prevMembers.filter(
            (member) =>
              !teamData.members
                .map((user) => user.handle)
                .includes(member.handle) && member.handle !== userData?.handle
          )
        : [...prevMembers, ...teamData.members.map((member) => member)]
    );
    // console.log(selectAll);
  };

  return (
    <>
      <div>
        {/* Dropdown trigger to open the modal */}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50">
            <div className="flex items-center justify-center min-h-screen xl:py-10">
              <div className="bg-white w-full md:w-1/2 lg:w-1/3 2xl:w-1/4 p-6 rounded shadow-lg">
                <div className="flex flex-col items-center justify-center mb-6">
                  <h2 className="text-xl text-primary font-bold">
                    Create Channel
                  </h2>
                  <hr className="w-16 border-t-4 border-accent mt-2" />
                </div>
                <label className="block text-primary">
                  <p className="mb-2 font-bold text-sm md:text-md">
                    Channel Name:
                  </p>
                  <input
                    type="text"
                    value={channelName}
                    onChange={handleNameChange}
                    className="w-full border border-gray-300 p-2 rounded text-sm md:text-md mb-4"
                    placeholder="Enter your channel name"
                  />
                </label>
                <label className="block mb-10 mt-4">
                  <p className="font-bold text-primary mb-2 text-sm  md:text-md">
                    Members:
                  </p>
                  <div className="space-y-2 border-2 p-2 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="mr-2"
                      />
                      <span className="text-primary uppercase text-xs md:text-sm">
                        Select All
                      </span>
                    </div>
                    {teamData.members
                      .filter((member) => member.handle !== userData?.handle)
                      .map((member) => (
                        <div
                          key={member.handle}
                          className="flex items-center bg-gray-100 p-2 hover:bg-gray-200 text-xs md:text-sm"
                        >
                          <label className="flex items-center w-full text-primary">
                            <input
                              type="checkbox"
                              checked={channelMembers.some(
                                (channelMember) =>
                                  channelMember.handle === member.handle
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  member.handle,
                                  member.firstName,
                                  member.lastName
                                )
                              }
                              className="mr-2"
                            />
                            {member.firstName} {member.lastName} (
                            {member.handle})
                          </label>
                        </div>
                      ))}
                  </div>
                </label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleCreateButtonClick}
                    className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-bold p-2 uppercase rounded hover:bg-primary hover:text-secondary"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    <span className="tracking-tight">Create</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-bold p-2 uppercase rounded hover:bg-primary hover:text-secondary"
                    onClick={closeModal}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                    <span className="tracking-tight">Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateChannel;
