import {
  DataSnapshot,
  get,
  ref,
  remove,
  set,
  update,
  onValue,
} from 'firebase/database';
import { db } from '../config/firebase-config';
import { ITeam } from '../common/types';
import { createGeneralChanel } from './channel.service';
import { v4 } from 'uuid';

export const fromTeamsDocument = (snapshot: DataSnapshot) => {
  const teamsDocument = snapshot.val();

  return Object.keys(teamsDocument).map((key) => {
    const team = teamsDocument[key];

    return {
      ...team,
    };
  });
};

export const createTeam = async (
  teamName: string,
  teamId: string,
  owner: string,
  members: string[]
) => {
  await set(ref(db, `teams/${teamName}`), {
    teamName,
    teamId,
    owner,
    members: [owner,...members],
    createdOn: Date.now(),
    channels: {},
  });
  await addTeamToUser(owner, teamName);
  members.forEach(async (member) => await addTeamToUser(member, teamName));
  await createGeneralChanel(teamName, members, v4(),owner);

  await update(ref(db, `teams/${teamName}/channels`), {
    general: true,
  });
};

export const addTeamToUser = async (handle: string, teamName: string) => {
  const userTeamsRef = ref(db, `users/${handle}/teams`);
  const snapshot = await get(userTeamsRef);

  if (snapshot.exists()) {
    update(ref(db), {
      [`users/${handle}/teams`]: [...snapshot.val(), teamName],
    });
  } else {
    update(ref(db), {
      [`users/${handle}/teams`]: [teamName],
    });
  }
};

export const getTeamByTeamName = (
  teamName: string,
  callback: (teamData: DataSnapshot | null) => void
) => {
  const teamRef = ref(db, `teams/${teamName}`);
  onValue(teamRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot : null);
  });
};

export const getAllTeams = (callback: (teamsArray: ITeam[]) => void) => {
  const teamsRef = ref(db, 'teams');

  const unsubscribe = onValue(teamsRef, (snapshot) => {
    const teamsData = snapshot.val();
    const teamsArray = Object.values(teamsData || {}).map(
      (teamData) => teamData as ITeam
    );
    callback(teamsArray);
  });

  return unsubscribe;
};

const removeTeamFromUsers = async (teamName: string, members: string[]) => {
  members.forEach(async (member) => {
    const userTeamsRef = ref(db, `users/${member}/teams`);
    const userTeamsSnapshot = await get(userTeamsRef);

    if (userTeamsSnapshot.exists()) {
      const updatedTeams = userTeamsSnapshot
        .val()
        .filter((team: string) => team !== teamName);
      await set(userTeamsRef, updatedTeams);
    }
  });
};

export const deleteTeam = async (teamName: string, owner: string) => {
  const teamSnapshot = await get(ref(db, `teams/${teamName}`));
  const teamData = teamSnapshot.val();

  if (teamData && teamData.owner === owner) {
    await removeTeamFromUsers(teamName, teamData.members);
    await remove(ref(db, `teams/${teamName}`));
  } else {
    console.error("You don't have permission to delete this team!");
  }
};

export const removeTeamFromUser = async (
  teamName: string,
  memberToRemove: string
) => {
  try {
    const userTeamsRef = ref(db, `users/${memberToRemove}/teams`);
    const userTeamsSnapshot = await get(userTeamsRef);

    if (userTeamsSnapshot.exists()) {
      const updatedTeams = userTeamsSnapshot
        .val()
        .filter((team: string) => team !== teamName);
      await set(ref(db, `users/${memberToRemove}/teams`), updatedTeams);
    }
  } catch (error) {
    console.error('Error removing team from user', error);
  }
};

export const removeMemberFromTeam = async (
  teamName: string,
  memberToRemove: string
) => {
  try {
    const teamSnapshot = await get(ref(db, `teams/${teamName}`));

    if (teamSnapshot.exists()) {
      const teamData = teamSnapshot.val();

      if (teamData.members.includes(memberToRemove)) {
        const updateMembers = teamData.members.filter(
          (member: string) => member !== memberToRemove
        );

        await removeTeamFromUser(teamName, memberToRemove);
        await update(ref(db, `teams/${teamName}`), {
          members: updateMembers,
        });
      } else {
        throw new Error('Member not found in the team!');
      }
    } else {
      throw new Error('Team not found!');
    }
  } catch (error) {
    console.error('Error removing member from team:', error);
  }
};

export const addMembersToTeam = async (teamName: string, members: string[]) => {
  try {
    const teamRef = ref(db, `teams/${teamName}/members`);
    const teamSnapshot = await get(teamRef);

    if (teamSnapshot.exists()) {
      const currentMembers = teamSnapshot.val();
      const updatedMembers = [...currentMembers, ...members];

      members.forEach(async (member) => await addTeamToUser(member, teamName));
      await set(teamRef, updatedMembers);
    }
  } catch (error) {
    console.error('Error adding members to team:', error);
  }
};

export const updateTeamName = async (
  currentTeamName: string,
  newTeamName: string
) => {
  try {
    const teamSnapshot = await get(ref(db, `teams/${currentTeamName}`));

    if (teamSnapshot.exists()) {
      const teamData = teamSnapshot.val();

      await update(ref(db, `teams/${currentTeamName}`), {
        teamName: newTeamName,
      });

      const teamMembers = teamData.members || [];
      teamMembers.forEach(async (member: string) => {
        const userTeamsRef = ref(db, `users/${member}/teams`);
        const userTeamsSnapshot = await get(userTeamsRef);

        if (userTeamsSnapshot.exists()) {
          const updatedTeams = userTeamsSnapshot
            .val()
            .map((team: string) =>
              team === currentTeamName ? newTeamName : team
            );
          await set(ref(db, `users/${member}/teams`), updatedTeams);
        }
      });
    } else {
      throw new Error('Team not found!');
    }
  } catch (error) {
    console.error('Error updating team name:', error);
  }
};

export const getAllTeamMembers = async (teamName: string) => {
  try {
    const snapshot = await get(ref(db, `teams/${teamName}/members`));

    if (snapshot.exists()) {
      return snapshot.val();
    }
  } catch (error) {
    console.error("Error fetching team members:", error);
  }
};
