import { useState, useEffect } from 'react';
import { getTeamByTeamName } from '../../../services/teams.service';
import SingleTeamView from '../../../views/MainSidebar/Teams/SingleTeamView';
import { getAllUsers } from '../../../services/users.service';

type ISingleTeamProps = {
  teamName: string;
  onDeleteTeam: (teamName: string, owner: string) => void;
};

type ITeamData = {
  owner: string;
  teamName: string;
  members: string[];
};

type IUser = {
  handle: string;
  firstName: string;
  lastName: string;
};

const SingleTeam: React.FC<ISingleTeamProps> = ({ teamName, onDeleteTeam }) => {
  const [teamData, setTeamData] = useState<ITeamData | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamSnapshot = await getTeamByTeamName(teamName);
        if (teamSnapshot.exists()) {
          const teamData = teamSnapshot.val();
          setTeamData(teamData);
        } else {
          console.error(`Team ${teamName} does not exist!`);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamData();
  }, [teamName]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData as IUser[]);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  if (!teamData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SingleTeamView
        teamData={teamData}
        onDeleteTeam={onDeleteTeam}
        users={users}
      />
    </>
  );
};

export default SingleTeam;
