import CreateTeam from '../../../components/MainSidebar/Teams/CreateTeam';
import SingleTeam from '../../../components/MainSidebar/Teams/SingleTeam';
import { useContext } from 'react';
import AppContext from '../../../context/AuthContext';
import { IAppContext, ITeam } from '../../../common/types';

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
};

const TeamsView: React.FC<ITeamsViewProps> = ({
  onCreateTeam,
  teams,
  onDeleteTeam,
  onRemoveMember,
  onAddMembersToTeam,
  onSaveTeamName,
}) => {
  const { userData } = useContext(AppContext) as IAppContext;

  return (
    <>
      <nav className="mt-6 -mx-3 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4">
            <label className="text-primary text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight uppercase dark:text-gray-400">
              Teams
            </label>
            <div className="flex items-center justify-between">
              <CreateTeam onCreateTeam={onCreateTeam} teams={teams} />
            </div>
          </div>
        </div>
        <hr className="mt-4" />
        <p className="px-7 text-gray-500 text-sm lg:text-[16px]">My teams</p>
        <div className="px-3">
          {teams &&
            teams.map(
              (team) =>
                Array.isArray(team.members) &&
                team.members.includes(userData?.handle ?? '') && (
                  <SingleTeam
                    key={team.teamId}
                    teamName={team.teamName}
                    onDeleteTeam={onDeleteTeam}
                    onRemoveMember={onRemoveMember}
                    onAddMembersToTeam={onAddMembersToTeam}
                    onSaveTeamName={onSaveTeamName}
                  />
                )
            )}
        </div>
      </nav>
    </>
  );
};

export default TeamsView;
