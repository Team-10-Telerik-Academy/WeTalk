import { ref, remove, set, get, update } from "@firebase/database";

import { useContext, useEffect, useState } from "react";

import { FaInfoCircle } from "react-icons/fa";

import { useNavigate } from "react-router";
import AppContext from "../../context/AuthContext";
import { IAppContext } from "../../common/types";
import { getAllUsers, getUserByHandle } from "../../services/users.service";
import { db } from "../../config/firebase-config";
import ChannelMedia from "./ChannelMedia";
import { getAllTeamMembers } from "../../services/teams.service";

interface IUserData {
  firstName: string;
  lastName: string;
  handle: string;
}

const ChannelSettings = ({ channel, channelId, teamName }) => {
  const modalId = `my_modal_${channelId}`;
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(channel.chatName || "");
  const { userData } = useContext(AppContext) as IAppContext;
  const [users, setUsers] = useState<IUserData[]>([]);
  const [view, setView] = useState("main"); // "main", "addMember", "uploadPhoto"
  const [members, setMembers] = useState<string[]>([]);
  const [channelMembers, setChannelMembers] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const result = await getAllTeamMembers(teamName);
        // setUsers(result);
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
    const members = [...channel.members];
    setChannelMembers(members);
    console.log("channel members:", channelMembers);
    console.log("users:", users);
  }, [channel.members]);

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

  const handleChannelDelete = () =>{
 
    const channelRef = ref(db, `channels/${channelId}`);
    remove(channelRef);
    navigate("../");
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedName(channel.channelName);
  };

  const handleSave = () => {
    const channelName = channelId;
    const dbRef = ref(db, "channels");

    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const channels = snapshot.val();
        const channelDataRef = ref(db, `channels/${channelName}`);
        set(channelDataRef, {
          ...channels[channelName!],
          channelName: editedName,
        });
      }
    });
    setEditMode(false);
  };

  const handleLeaveGroup = () => {
    const channelName = channelId;
    const userHandle = userData?.handle;
    const channelRef = ref(db, `channels/${channelName}`);

    get(channelRef).then((snapshot) => {
      if (snapshot.exists()) {
        const channelData = snapshot.val();
       
        const updatedMembers = channelData.members.filter(
          (member) => member !== userHandle
        );
        //  console.log(channelData)
        set(channelRef, {
          ...channelData,
          members: updatedMembers,
        });
        navigate("../");
      }
    });
  };

  
  const handleCancel = () => {
    setEditedName(channel.channelName);
    setEditMode(false);
  };

  const handleChangeView = (newView) => {
    setView(newView);
  };

  const handleAddMembers = () => {
    const channelRef = ref(db, `channels/${channel.channelId}`);

    get(channelRef).then((snapshot) => {
      if (snapshot.exists()) {
        const channelData = snapshot.val();

        const updatedMembers = [...channelData.members, ...members];

        set(channelRef, {
          ...channelData,
          members: updatedMembers,
        });

        setMembers([]);

        console.log("Members added:", members);
      }
    });
  };

  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [teamMembersFullName, setTeamMembersFullName] = useState<IUserData[]>([]);
  const [channelUsers, setChannelUsers] = useState<IUserData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllTeamMembers(teamName);
        setTeamMembers(result);
       // console.log(teamMembers)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
      fetchUsers();
    
  }, [users.length]);


  useEffect(() => {
    const handleUserByHandle = async () => {
      try {
        const teamData = [];

        for (const member of teamMembers) {
          const snapshot = await getUserByHandle(member);

          if (snapshot.exists()) {
            const userDataForMember = snapshot.val();
            if (userDataForMember) {
              teamData.push({
                firstName: userDataForMember.firstName,
                lastName: userDataForMember.lastName,
                handle: userDataForMember.handle,
              });
            }
          }
        }
        setTeamMembersFullName(teamData);
       // console.log(teamMembersFullName);
        return userData;
      } catch (error) {
        console.error(error);
      }
    };
    handleUserByHandle();
  }, [teamMembers, userData]);	

  useEffect(() => {
    const handleUserByHandle = async () => {
      try {
        const userData = [];

        for (const member of channelMembers) {
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
        setChannelUsers(userData);
      //  console.log(channelUsers)
        return userData;
      } catch (error) {
        console.error(error);
      }
    };
    handleUserByHandle();
  }, [channelMembers]);

  const isChannelOwner = channel.userHandle === userData?.handle;

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
                {isChannelOwner && (
                  <div>
                    {channel.channelName && (
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
                            <p className="text-xl font-bold">
                              {channel.channelName}
                            </p>
                            <button className="text-sm" onClick={handleEdit}>
                              Edit channel name
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
                        className="btn bg-error/70 hover:bg-error w-64 my-0.5 shadow-inner shadow-error"
                        onClick={handleChannelDelete}
                      >
                        delete channel
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <button
                    className="btn bg-primary/10 my-0.5 shadow-inner shadow-secondary"
                    onClick={() => handleChangeView("media")}
                  >
                    media
                  </button>

                  <button
                    className="btn bg-error/70 hover:bg-error w-64 my-0.5 shadow-inner shadow-error"
                    onClick={handleLeaveGroup}
                  >
                    leave channel
                  </button>
                </div>
              </div>
            )}

            {view === "addMember" && (
              <div className="w-64">
                <div className="mb-3">
                  <p className="font-bold underline">Members:</p>
                  {channelUsers.map((user) => (
                    <p className="border-b font-bold text-lg">
                      {user.firstName} {user.lastName} ({user.handle})
                    </p>
                  ))}
                </div>
                <div className="overflow-y-auto h-64">
                  <div>
                    <p>add Member:</p>
                    <input
                      type="text"
                      className="border w-full mb-2 rounded-lg pl-0.5"
                    />
                  </div>
                  {teamMembersFullName
                    .filter(
                      (user) =>
                        user.handle !== userData?.handle &&
                        !channelUsers.some(
                          (member) => member.handle === user.handle
                        )
                    )
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
                <div className="flex justify-between">
                  <button className="btn" onClick={handleAddMembers}>
                    Add
                  </button>
                  <button
                    className="btn"
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
                  <p className="font-bold underline text-center">Media</p>
                </div>
                <ChannelMedia channelId={channelId} />
                <div className="overflow-y-auto h-64"></div>
                <div className="flex justify-center">
                  <button
                    className="btn"
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

export default ChannelSettings;
