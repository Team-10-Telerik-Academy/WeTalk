import { DataSnapshot, get, ref, remove, set, update } from 'firebase/database';
import { db } from '../config/firebase-config';

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
    members: [owner, ...members],
    createdOn: Date.now(),
    channels: {},
  });
  addTeamToUser(owner, teamName);
  members.forEach((member) => addTeamToUser(member, teamName));
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

export const getTeamByTeamName = (teamName: string) => {
  return get(ref(db, `teams/${teamName}`));
};

export const getAllTeamsByName = async () => {
  try {
    const userRef = ref(db, `teams`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const usersData = userSnapshot.val();
      const usersArray = Object.keys(usersData).map((teamName) => teamName);
      return usersArray;
    } else {
      throw new Error(`Users not found`);
    }
  } catch (error) {
    console.error(error);
  }
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
