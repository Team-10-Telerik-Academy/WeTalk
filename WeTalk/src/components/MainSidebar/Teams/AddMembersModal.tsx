// import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { IAppContext, ITeam } from '../../../common/types';
// import AppContext from '../../../context/AuthContext';
import Profile from '../../Profile/Profile';
 
type IUser = {
  handle: string;
  firstName: string;
  lastName: string;
};
 
type AddMembersModalProps = {
  teamData: ITeam;
  users: IUser[];
  availableMembersToAdd: IUser[];
  isOpen: boolean;
  onClose: () => void;
  onAddMembersToTeam: (selectedMembers: string[]) => void;
};
 
const AddMembersModal: React.FC<AddMembersModalProps> = ({
  teamData,
  users,
  availableMembersToAdd,
  isOpen,
  onClose,
  onAddMembersToTeam,
}) => {
  // const { userData } = useContext(AppContext) as IAppContext;
 
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen xl:py-10">
            <div className="bg-white w-full md:w-1/2 lg:w-1/3 2xl:w-1/4 pt-6 rounded shadow-lg animate-jump-in">
              <div className="flex flex-col items-center justify-center mb-8">
                <h2 className="text-xl text-primary font-extrabold text-center uppercase">
                  Add members to {teamData.teamName}
                </h2>
                <hr className="w-12 border-t-4 border-accent mt-2" />
              </div>
              {availableMembersToAdd.length > 0 ? (
                <div className="space-y-2 p-2 rounded mb-10">
                  {availableMembersToAdd.map((member) => (
                    <div
                      key={member.handle}
                      className="flex items-center justify-between border border-primary rounded p-2 hover:bg-primary hover:bg-opacity-5"
                    >
                      <div className="flex items-center p-1">
                        {users
                          .filter((user) => user.handle === member.handle)
                          .map((user) => (
                            <div className="flex gap-2 items-center">
                              <Profile handle={user.handle} />
                              <div
                                key={user.handle}
                                className="text-xs md:text-sm text-primary"
                              >
                                {user.firstName} {user.lastName} ({user.handle})
                              </div>
                            </div>
                          ))}
                      </div>
                      {/*{userData?.handle === teamData.owner && (*/}
                      <FontAwesomeIcon
                        icon={faUserPlus}
                        className="text-primary cursor-pointer text-xs md:text-lg md:pr-2"
                        onClick={() => onAddMembersToTeam([member])}
                      />
                      {/*)}*/}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-between mb-10">
                  <p>No available users!</p>
                </div>
              )}
              <div className="flex items-center justify-center">
                <button
                  className="bg-accent text-primary font-bold px-4 py-2 rounded hover:bg-primary hover:text-secondary w-full"
                  onClick={onClose}
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
 
export default AddMembersModal;
