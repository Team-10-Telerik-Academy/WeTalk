import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AuthContext';
import {
  createTeam,
  deleteTeam,
  getAllTeamsByName,
} from '../../../services/teams.service';
import TeamsView from '../../../views/MainSidebar/Teams/TeamsView';
import { v4 } from 'uuid';
import { IAppState } from '../../../common/types';

const Teams = () => {
  const { userData } = useContext(AppContext) as IAppState;
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const allTeams = await getAllTeamsByName();
        setTeams(allTeams!);
      } catch (error) {
        console.error('Error fetching teams', error);
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = async (teamName: string, members: string[]) => {
    try {
      setTeams((prevTeams) => [...prevTeams, teamName]);
      await createTeam(
        teamName,
        v4(),
        userData?.handle || '',
        members.map((member) => member)
      );
    } catch (error) {
      console.error('Error creating team', error);
    }
  };

  const handleDeleteTeam = async (teamName: string, owner: string) => {
    try {
      setTeams((prevTeams) => prevTeams?.filter((team) => team !== teamName));
      await deleteTeam(teamName, owner);
    } catch (error) {
      console.error('Error deleting team', error);
    }
  };

  return (
    <>
      <TeamsView
        onCreateTeam={handleCreateTeam}
        teams={teams}
        onDeleteTeam={handleDeleteTeam}
      />
    </>
  );
};

export default Teams;
