import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronDown,
  faPeopleGroup,
  faPenToSquare,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'flowbite-react';
import { useState } from 'react';
import nhAvatar from '../../../assets/images/avatar-NH.jpg';

type IUser = {
  handle: string;
  firstName: string;
  lastName: string;
};

type ISingleTeamViewProps = {
  teamData: {
    owner: string;
    teamName: string;
    members: string[];
  };
  onDeleteTeam: (teamName: string, owner: string) => void;
  users: IUser[];
};

const SingleTeamView: React.FC<ISingleTeamViewProps> = ({
  teamData,
  onDeleteTeam,
  users,
}) => {
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const openMembersModal = () => {
    setIsMembersModalOpen(true);
  };

  const closeMembersModal = () => {
    setIsMembersModalOpen(false);
  };

  const handleDeleteTeam = async () => {
    onDeleteTeam(teamData.teamName, teamData.owner);
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 p-4 hover:bg-gray-200">
        <div className="flex items-center justify-between w-full">
          <div className="inline-flex w-full items-center gap-2">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-primary cursor-pointer"
            />
            <p className="inline-flex text-gray-500 tracking-wide">
              {teamData.teamName}
            </p>
          </div>

          <Dropdown
            label=""
            placement="right"
            dismissOnClick={false}
            renderTrigger={() => (
              <span>
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="text-primary cursor-pointer"
                />
              </span>
            )}
          >
            <Dropdown.Item onClick={openMembersModal}>
              <div className="flex gap-1 items-center">
                <FontAwesomeIcon
                  icon={faPeopleGroup}
                  className="text-primary cursor-pointer"
                />
                Members ({teamData.members.length})
              </div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="text-primary cursor-pointer"
                />
                Edit
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleDeleteTeam}>
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="text-primary cursor-pointer"
                />
                Delete
              </div>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      {isMembersModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white w-96 p-6 rounded shadow-lg">
              <div className="flex flex-col items-center justify-center mb-10">
                <h2 className="text-2xl text-primary font-bold">
                  {teamData.teamName} Members
                </h2>
                <hr className="w-16 border-t-4 border-accent mt-2" />
              </div>
              <div className="space-y-2 border-2 p-2 rounded mb-10">
                {teamData.members.map((member) => (
                  <div
                    key={member}
                    className="flex items-center justify-between bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <img src={nhAvatar} className="rounded-full w-10 h-10" />
                      {users
                        .filter((user) => user.handle === member)
                        .map(
                          (user) =>
                            `${user.firstName} ${user.lastName} (${user.handle})`
                        )}
                    </div>
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      className="text-primary cursor-pointer pr-2"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-accent text-primary font-bold px-4 py-2 rounded hover:bg-primary hover:text-secondary w-full"
                  onClick={closeMembersModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleTeamView;
