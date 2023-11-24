import CreateTeam from '../../../components/MainSidebar/Teams/CreateTeam';
import SingleTeam from '../../../components/MainSidebar/Teams/SingleTeam';

type ITeamsViewProps = {
  onCreateTeam: (teamName: string, members: string[]) => void;
  teams: string[];
  onDeleteTeam: (teamName: string, owner: string) => void;
};

const TeamsView: React.FC<ITeamsViewProps> = ({
  onCreateTeam,
  teams,
  onDeleteTeam,
}) => {
  return (
    <>
      <nav className="mt-6 -mx-3 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4">
            <label className="text-primary text-2xl font-extrabold tracking-tight uppercase dark:text-gray-400">
              Teams
            </label>
            <div className="flex items-center justify-between">
              <CreateTeam onCreateTeam={onCreateTeam} teams={teams} />
            </div>
          </div>
        </div>
        <hr className="mt-4" />
        <p className="px-7 text-gray-500">My teams</p>
        <div className="px-3 space-y-4">
          {teams.map((teamName) => (
            <SingleTeam
              key={teamName}
              teamName={teamName}
              onDeleteTeam={onDeleteTeam}
            />
          ))}
        </div>
      </nav>
    </>
  );
};

export default TeamsView;
