import { useState, useEffect, useContext } from 'react';
import { getAllUsers } from '../../../services/users.service';
import AppContext from '../../../context/AuthContext';
import {
  faPlus,
  faListCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IAppContext } from '../../../common/types';

type ICreateTeamProps = {
  onCreateTeam: (teamName: string, members: string[]) => void;
  teams: string[];
};

type IUser = {
  handle: string;
  firstName: string;
  lastName: string;
};

const CreateTeam: React.FC<ICreateTeamProps> = ({ onCreateTeam, teams }) => {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userData } = useContext(AppContext) as IAppContext;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData!);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [userData, users]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTeamName('');
    setMembers([]);
    setSelectAll(false);
  };

  const handleCreateTeam = () => {
    if (teamName.trim() === '') {
      return;
    }

    if (teams.includes(teamName)) {
      console.log('Team already exists');
      setTeamName('');
      setMembers([]);
      setSelectAll(false);
      return;
    }

    onCreateTeam(teamName, members);

    setTeamName('');
    setMembers([]);
    setSelectAll(false);
    closeModal();
  };

  const handleCheckboxChange = (handle: string) => {
    setMembers((prevMembers) =>
      prevMembers.includes(handle)
        ? prevMembers.filter((member) => member !== handle)
        : [...prevMembers, handle]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setMembers((prevMembers) =>
      selectAll
        ? prevMembers.filter(
            (member) => !users.map((user) => user.handle).includes(member)
          )
        : [...prevMembers, ...users.map((user) => user.handle)]
    );
  };

  return (
    <div className="relative">
      {/* Button to open the modal */}
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 bg-accent text-primary text-sm uppercase p-2 rounded hover:bg-primary hover:text-secondary"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span className="tracking-tight">Create</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white w-1/4 p-6 rounded shadow-lg">
              <div className="flex flex-col items-center justify-center mb-6">
                <h2 className="text-2xl text-primary font-bold">Create Team</h2>
                <hr className="w-16 border-t-4 border-accent mt-2" />
              </div>
              <label className="block text-primary">
                <p className="mb-2 font-bold">Team Name:</p>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </label>
              <label className="block mb-10 mt-4">
                <p className="font-bold text-primary mb-2">Members:</p>
                <div className="space-y-2 border-2 p-2 rounded">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="mr-2"
                    />
                    <span className="text-primary uppercase">Select All</span>
                  </div>
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
              </label>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleCreateTeam}
                  className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-bold px-4 py-2 uppercase rounded hover:bg-primary hover:text-secondary"
                >
                  <FontAwesomeIcon icon={faListCheck} />
                  <span className="tracking-tight">Create</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-bold px-4 py-2 uppercase rounded hover:bg-primary hover:text-secondary"
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
  );
};

export default CreateTeam;
