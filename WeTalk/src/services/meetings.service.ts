import { onValue, ref, set } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createMeeting = async (
  meetingId: string,
  meetingTitle: string,
  members: any[],
  startDate: any,
  endDate: any,
  teamName: string
) => {
  await set(ref(db, `meetings/${teamName}`), {
    meetingId,
    title: meetingTitle,
    members: [...members],
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    createdOn: Date.now(),
    teamName,
  });
};

export const getAllTeamMeetings = (
  userTeams: string[],
  callback: (teamMeetings) => void
) => {
  if (userTeams) {
    const teamsRef = ref(db, 'meetings');
    console.log(userTeams);

    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const teamsData = snapshot.val();
      const teamMeetings = Object.values(teamsData).filter((team) =>
        userTeams.includes(team.teamName)
      );
      callback(teamMeetings);
    });

    return unsubscribe;
  } else {
    return [];
  }
};
