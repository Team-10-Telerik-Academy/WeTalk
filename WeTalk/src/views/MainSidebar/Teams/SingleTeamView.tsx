import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronRight,
  faChevronDown,
  faPeopleGroup,
  faPenToSquare,
  faEllipsis,
  faPlus,
  faUserPlus,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'flowbite-react';
import { useContext, useState } from 'react';
import AppContext from '../../../context/AuthContext';
import { IAppContext, ITeam } from '../../../common/types';
import MembersModal from '../../../components/MainSidebar/Teams/MembersModal';
import AddMembersModal from '../../../components/MainSidebar/Teams/AddMembersModal';

// import nhAvatar from "../../../assets/images/avatar-NH.jpg";
// import Profile from "../../../components/Profile/Profile";

type IUser = {
  handle: string;
  firstName: string;
  lastName: string;
};

type ISingleTeamViewProps = {
  teamData: ITeam;
  onDeleteTeam: (teamName: string, owner: string) => void;
  onRemoveMember: (
    teamName: string,
    owner: string,
    memberToRemove: string
  ) => void;
  users: IUser[];
  onAddMembersToTeam: (teamName: string, members: string[]) => void;
  onSaveTeamName: (teamData: ITeam, newName: string) => void;
};

const SingleTeamView: React.FC<ISingleTeamViewProps> = ({
  teamData,
  onDeleteTeam,
  onRemoveMember,
  users,
  onAddMembersToTeam,
  onSaveTeamName,
}) => {
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [isChannelsVisible, setIsChannelsVisible] = useState(false);
  const [availableMembersToAdd, setAvailableMembersToAdd] = useState<IUser[]>(
    []
  );
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState(teamData.teamName);

  const { userData } = useContext(AppContext) as IAppContext;

  const openMembersModal = () => {
    setIsMembersModalOpen(true);
  };

  const closeMembersModal = () => {
    setIsMembersModalOpen(false);
  };

  const openAddMembersModal = () => {
    setIsAddMembersModalOpen(true);

    const nonMembers = users.filter(
      (user) => !teamData.members.includes(user.handle)
    );
    setAvailableMembersToAdd(nonMembers);
  };

  const closeAddMembersModal = () => {
    setIsAddMembersModalOpen(false);
    setAvailableMembersToAdd([]);
  };

  const handleDeleteTeam = async () => {
    onDeleteTeam(teamData.teamName, teamData.owner);
  };

  const handleToggleChannels = () => {
    setIsChannelsVisible(!isChannelsVisible);
  };

  const handleRemoveMember = (selectedMember: string) => {
    onRemoveMember(teamData.teamName, teamData.owner, selectedMember);
  };

  const handleAddMembersToTeam = (selectedMember: string[]) => {
    onAddMembersToTeam(teamData.teamName, selectedMember);
    closeAddMembersModal();
  };

  const handleOnSaveTeamName = (newName: string) => {
    onSaveTeamName(teamData, newName);
    setIsEditingTeamName(false);
  };

  const handleEditTeamName = () => {
    setIsEditingTeamName(!isEditingTeamName);
  };

  return (
    <>
      <div className="flex items-center justify-center bg-primary bg-opacity-5 py-2 px-4 lg:p-4 mb-2 mt-4 rounded hover:bg-gray-200">
        <div className="flex items-center justify-between w-full">
          <div className="inline-flex w-full items-center gap-2">
            <FontAwesomeIcon
              icon={isChannelsVisible ? faChevronDown : faChevronRight}
              className="text-primary cursor-pointer text-xs lg:text-sm"
              onClick={handleToggleChannels}
            />
            {isEditingTeamName ? (
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="inline-flex text-primary tracking-wide w-full focus:outline-none focus:ring focus:border-blue-300 p-2 mr-2 ml-2 rounded text-xs lg:text-sm"
              />
            ) : (
              <p className="inline-flex text-primary tracking-wide font-bold text-xs lg:text-[16px]">
                {teamData.teamName}
              </p>
            )}
          </div>

          {isEditingTeamName ? (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handleOnSaveTeamName(newTeamName)}
                className="inline-flex items-center gap-1 text-primary uppercase hover:underline text-xs"
              >
                <FontAwesomeIcon icon={faCheck} />
                <span className="tracking-tight">Save</span>
              </button>
              <button
                onClick={() => setIsEditingTeamName(false)}
                className="inline-flex items-center gap-1 text-primary uppercase hover:underline text-xs"
              >
                <FontAwesomeIcon icon={faXmark} />
                <span className="tracking-tight">Cancel</span>
              </button>
            </div>
          ) : (
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span>
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    className="text-primary cursor-pointer text-xs lg:text-lg"
                  />
                </span>
              )}
            >
              <Dropdown.Item onClick={openAddMembersModal}>
                <div className="flex gap-1 items-center hover:bg-gray-100 text-xs lg:text-sm">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="text-primary cursor-pointer text-xs lg:text-sm"
                  />
                  Add members
                </div>
              </Dropdown.Item>
              <Dropdown.Item onClick={openMembersModal}>
                <div className="flex gap-1 items-center hover:bg-gray-100 text-xs lg:text-sm">
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    className="text-primary cursor-pointer text-xs lg:text-sm"
                  />
                  Members ({teamData.members.length})
                </div>
              </Dropdown.Item>
              {teamData.owner === userData?.handle && (
                <>
                  <Dropdown.Item>
                    <div className="flex gap-2 items-center hover:bg-gray-100 text-xs lg:text-sm">
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="text-primary cursor-pointer text-xs lg:text-sm"
                      />
                      Add channel
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleEditTeamName}>
                    <div className="flex gap-2 items-center hover:bg-gray-100 text-xs lg:text-sm">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-primary cursor-pointer text-xs lg:text-sm"
                      />
                      Edit
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDeleteTeam}>
                    <div className="flex gap-2 items-center hover:bg-gray-100 text-xs lg:text-sm">
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="text-primary cursor-pointer text-xs lg:text-sm"
                      />
                      Delete
                    </div>
                  </Dropdown.Item>
                </>
              )}
            </Dropdown>
          )}
        </div>
      </div>

      {isChannelsVisible && (
        <div className="">
          <div className="px-10 pb-2 text-xs lg:text-[16px]">
            <p className="text-gray-500  cursor-pointer hover:text-primary hover:underline">
              #general
            </p>
          </div>
          <div className="px-10 text-xs lg:text-[16px]">
            <p className="text-gray-500  cursor-pointer hover:text-primary hover:underline">
              #Announcements
            </p>
          </div>
        </div>
      )}

      <MembersModal
        teamData={teamData}
        users={users}
        isOpen={isMembersModalOpen}
        onClose={closeMembersModal}
        onRemoveMember={handleRemoveMember}
      />

      <AddMembersModal
        teamData={teamData}
        users={users}
        availableMembersToAdd={availableMembersToAdd}
        isOpen={isAddMembersModalOpen}
        onClose={closeAddMembersModal}
        onAddMembersToTeam={handleAddMembersToTeam}
      />
    </>
  );
};

export default SingleTeamView;
