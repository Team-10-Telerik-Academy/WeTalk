import CreateTeam from '../../../components/MainSidebar/Teams/CreateTeam';
import SingleTeam from '../../../components/MainSidebar/Teams/SingleTeam';
import { useContext } from 'react';
import AppContext from '../../../context/AuthContext';
import { IAppContext, ITeam, IUserData } from '../../../common/types';
import SearchBar from '../../../components/SearchBar/SearchBar';
 
type ITeamsViewProps = {
  onCreateTeam: (teamName: string, members: string[]) => void;
  teams: ITeam[];
  onDeleteTeam: (teamName: string, owner: string) => void;
  onRemoveMember: (
    teamName: string,
    owner: string,
    memberToRemove: string
  ) => void;
  onAddMembersToTeam: (teamName: string, members: string[]) => void;
  onSaveTeamName: (teamData: ITeam, newName: string) => void;
  users: IUserData[];
};
 
const TeamsView: React.FC<ITeamsViewProps> = ({
  onCreateTeam,
  teams,
  onDeleteTeam,
  onRemoveMember,
  onAddMembersToTeam,
  onSaveTeamName,
  users,
}) => {
  const { userData } = useContext(AppContext) as IAppContext;
 
  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen px-4 py-8 border-r overflow-y-auto bg-secondary w-full sm:w-1/3 md:w-1/3 lg:w-[3000px] xl:w-[3000px] 2xl:w-full dark:bg-gray-900 dark:border-gray-700">
      <SearchBar />
      <nav className="mt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-primary text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight uppercase dark:text-gray-400">
              Teams
            </label>
            <div className="flex items-center justify-between">
              <CreateTeam
                onCreateTeam={onCreateTeam}
                teams={teams}
                users={users}
              />
            </div>
          </div>
        </div>
        <hr className="mt-4" />
        {/* <p className="px-7 text-gray-500 text-sm lg:text-[16px]">My teams</p> */}
        <div>
          {teams &&
            teams.map(
              (team) =>
                Array.isArray(team.members) &&
                team.members.some(
                  (member) => member.handle === userData?.handle
                ) && (
                  <SingleTeam
                    key={team.teamId}
                    teamName={team.teamName}
                    onDeleteTeam={onDeleteTeam}
                    onRemoveMember={onRemoveMember}
                    onAddMembersToTeam={onAddMembersToTeam}
                    onSaveTeamName={onSaveTeamName}
                    users={users}
                  />
                )
            )}
        </div>
      </nav>
    </div>
  );
};
 
export default TeamsView;
