import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AuthContext';
import {
  addMembersToTeam,
  createTeam,
  deleteTeam,
  getAllTeams,
  removeMemberFromTeam,
  updateTeamName,
} from '../../../services/teams.service';
import TeamsView from '../../../views/MainSidebar/Teams/TeamsView';
import { v4 } from 'uuid';
import { IAppState, ITeam, IUserData } from '../../../common/types';
import { getAllUsers } from '../../../services/users.service';
import MainContent from '../../MainContent/MainContent';

const Teams = () => {
  const { userData } = useContext(AppContext) as IAppState;
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [users, setUsers] = useState<IUserData[]>([]);

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
      console.error('Error fetching users', error);
    }
  }, []);

  useEffect(() => {
    const teamsCallback = (teamsData: ITeam[]) => {
      setTeams(teamsData);
    };

    const unsubscribe = getAllTeams(teamsCallback);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCreateTeam = async (teamName: string, members: string[]) => {
    try {
      await createTeam(
        teamName,
        v4(),
        userData?.handle || '',
        members
          .filter((member) => member !== userData?.handle)
          .map((member) => member)
      );
    } catch (error) {
      console.error('Error creating team', error);
    }
  };

  const handleDeleteTeam = async (teamName: string, owner: string) => {
    try {
      setTeams((prevTeams) =>
        prevTeams?.filter((team) => team.teamName !== teamName)
      );
      await deleteTeam(teamName, owner);
    } catch (error) {
      console.error('Error deleting team', error);
    }
  };

  const handleDeleteTeamMember = async (
    teamName: string,
    owner: string,
    memberToRemove: string
  ) => {
    try {
      if (memberToRemove === owner) {
        await deleteTeam(teamName, owner);
      } else {
        await removeMemberFromTeam(teamName, memberToRemove);
      }
    } catch (error) {
      console.error('Error deleting team member', error);
    }
  };

  const handleAddMembersToTeam = async (
    teamName: string,
    members: string[]
  ) => {
    try {
      await addMembersToTeam(teamName, members);
    } catch (error) {
      console.error('Error adding members to team', error);
    }
  };

  const handleSaveTeamName = async (teamData: ITeam, newName: string) => {
    try {
      await updateTeamName(teamData.teamName, newName);
    } catch (error) {
      console.error('Error updating team name', error);
    }
  };

  return (
    <>
      <TeamsView
        onCreateTeam={handleCreateTeam}
        teams={teams}
        onDeleteTeam={handleDeleteTeam}
        onRemoveMember={handleDeleteTeamMember}
        onAddMembersToTeam={handleAddMembersToTeam}
        onSaveTeamName={handleSaveTeamName}
        users={users}
      />
      <MainContent />
    </>
  );
};

export default Teams;
