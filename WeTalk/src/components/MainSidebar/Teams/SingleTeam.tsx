import { useState, useEffect } from 'react';
import { getTeamByTeamName } from '../../../services/teams.service';
import SingleTeamView from '../../../views/MainSidebar/Teams/SingleTeamView';
import { getAllUsers } from '../../../services/users.service';
import { ITeam, IUserData } from '../../../common/types';

type ISingleTeamProps = {
  teamName: string;
  onDeleteTeam: (teamName: string, owner: string) => void;
  onRemoveMember: (
    teamName: string,
    owner: string,
    memberToRemove: string
  ) => void;
  onAddMembersToTeam: (teamName: string, members: string[]) => void;
  onSaveTeamName: (teamData: ITeam, newName: string) => void;
};

const SingleTeam: React.FC<ISingleTeamProps> = ({
  teamName,
  onDeleteTeam,
  onRemoveMember,
  onAddMembersToTeam,
  onSaveTeamName,
}) => {
  const [teamData, setTeamData] = useState<ITeam | null>(null);
  const [users, setUsers] = useState<IUserData[]>([]);

  useEffect(() => {
    const fetchTeamData = () => {
      try {
        getTeamByTeamName(teamName, (teamSnapshot) => {
          if (teamSnapshot && teamSnapshot.exists()) {
            const teamData = teamSnapshot.val();
            setTeamData(teamData);
          }
        });
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamData();
  }, [teamName]);

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
      console.log('Error fetching users', error);
    }
  }, []);

  if (!teamData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SingleTeamView
        teamData={teamData}
        onDeleteTeam={onDeleteTeam}
        onRemoveMember={onRemoveMember}
        users={users}
        onAddMembersToTeam={onAddMembersToTeam}
        onSaveTeamName={onSaveTeamName}
      />
    </>
  );
};

export default SingleTeam;
