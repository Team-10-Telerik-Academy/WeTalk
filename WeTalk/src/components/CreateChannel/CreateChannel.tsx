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
import { getAllTeamMembers } from "../../services/teams.service";
import { createChannel } from "../../services/channel.service";

interface IUserData {
  firstName: string;
  lastName: string;
  handle: string;
}

const CreateChannel = ({ teamName, isModalOpen, setIsModalOpen }) => {
  const [users, setUsers] = useState<IUserData[]>([]);
  const { userData } = useContext(AppContext) as IAppContext;
  const [members, setMembers] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  const [channelName, setChannelName] = useState<string>("");
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  //const teamName: string = 'Team 10';

  // useEffect(() => {
  //   if (isOpenInitially) {
  //     openModal();
  //   }
  // }, [isOpenInitially]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllTeamMembers(teamName);
        setTeamMembers(result);
        //console.log(teamMembers)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length]);
  //console.log(teamName);

  const handleCheckboxChange = (handle: string) => {
    setMembers((prevMembers) =>
      prevMembers.includes(handle)
        ? prevMembers.filter((member: string) => member !== handle)
        : [...prevMembers, handle]
    );
  };
  const handleCreateChannel = async (
    channelName: string,
    members: string[]
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
        const userHandle = userData?.handle;
        if (userHandle) {
          const updatedMembers = [...members, userHandle];
          await createChannel(channelName, updatedMembers, v4(), teamName);
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
    handleCreateChannel(channelName, members);
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

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setMembers((prevMembers) =>
      selectAll
        ? prevMembers.filter(
            (member) =>
              !teamMembers.includes(member) && member !== userData?.handle
          )
        : [...prevMembers, ...teamMembers]
    );
  };

  useEffect(() => {
    const handleUserByHandle = async () => {
      try {
        const userData = [];

        for (const member of teamMembers) {
          const snapshot = await getUserByHandle(member);

          if (snapshot.exists()) {
            const userDataForMember = snapshot.val();
            if (userDataForMember) {
              userData.push({
                firstName: userDataForMember.firstName,
                lastName: userDataForMember.lastName,
                handle: userDataForMember.handle,
              });
            }
          }
        }
        setUsers(userData);
        return userData;
      } catch (error) {
        console.error(error);
      }
    };
    handleUserByHandle();
  }, [teamMembers]);

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
                    {users
                      .filter((user) => user.handle !== userData?.handle)
                      .map((user) => (
                        <div
                          key={user.handle}
                          className="flex items-center bg-gray-100 p-2 hover:bg-gray-200 text-xs md:text-sm"
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
