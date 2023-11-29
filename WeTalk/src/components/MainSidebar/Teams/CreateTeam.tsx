import { useState, useEffect, useContext } from "react";
import { getAllUsers } from "../../../services/users.service";
import AppContext from "../../../context/AuthContext";
import { faPlus, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IAppContext, ITeam, IUserData } from "../../../common/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MAX_TEAM_NAME_LENGTH,
  MIN_TEAM_NAME_LENGTH,
} from "../../../common/constants";

type ICreateTeamProps = {
  onCreateTeam: (teamName: string, members: string[]) => void;
  teams: ITeam[];
};

const CreateTeam: React.FC<ICreateTeamProps> = ({ onCreateTeam, teams }) => {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState<IUserData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userData } = useContext(AppContext) as IAppContext;

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTeamName("");
    setMembers([]);
    setSelectAll(false);
  };

  const handleCreateTeam = async () => {
    if (!teamName) {
      toast.warning("Team Name is required!", {
        autoClose: 3000,
        className: "font-bold",
      });
      return;
    }

    if (
      teamName.length < MIN_TEAM_NAME_LENGTH ||
      teamName.length > MAX_TEAM_NAME_LENGTH
    ) {
      toast.warning(
        `Team Name must contain between ${MIN_TEAM_NAME_LENGTH} and ${MAX_TEAM_NAME_LENGTH} characters!`,
        {
          autoClose: 3000,
          className: "font-bold",
        }
      );
      return;
    }

    if (teams.some((team) => team.teamName === teamName)) {
      toast.warning(`Team with name ${teamName} already exists!`, {
        autoClose: 3000,
        className: "font-bold",
      });
      setTeamName("");
      setMembers([]);
      setSelectAll(false);
      return;
    }

    onCreateTeam(teamName, members);

    setTeamName("");
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
            (member) =>
              !users.map((user) => user.handle).includes(member) &&
              member !== userData?.handle
          )
        : [...prevMembers, ...users.map((user) => user.handle)]
    );
  };

  return (
    <>
      <div className="relative">
        {/* Button to open the modal */}
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 bg-accent text-primary text-xs uppercase p-2 lg:px-3 lg:py-2 rounded hover:bg-primary hover:text-secondary"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="tracking-tight text-xs lg:text-sm">Create</span>
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50">
            <div className="flex items-center justify-center min-h-screen xl:py-10">
              <div className="bg-white w-full md:w-1/2 lg:w-1/3 2xl:w-1/4 p-6 rounded shadow-lg">
                <div className="flex flex-col items-center justify-center mb-6">
                  <h2 className="text-xl text-primary font-bold">
                    Create Team
                  </h2>
                  <hr className="w-16 border-t-4 border-accent mt-2" />
                </div>
                <label className="block text-primary">
                  <p className="mb-2 font-bold text-sm md:text-md">
                    Team Name:
                  </p>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded text-sm md:text-md"
                    placeholder="Enter your team name"
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
                    onClick={handleCreateTeam}
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

export default CreateTeam;
