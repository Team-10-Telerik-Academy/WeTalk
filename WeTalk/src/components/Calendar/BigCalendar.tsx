import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useContext, useEffect, useState } from 'react';
import enUS from 'date-fns/locale/en-US';
import { getUserTeams } from '../../services/teams.service';
import AppContext from '../../context/AuthContext';
import { IAppContext } from '../../common/types';
import { getAllTeamMeetings } from '../../services/meetings.service';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// const events = [
//   {
//     title: 'Big Meeting',
//     allDay: true,
//     start: new Date(2023, 12, 0),
//     end: new Date(2023, 12, 0),
//   },
//   {
//     title: 'Vacation',
//     start: new Date(2023, 11, 7),
//     end: new Date(2023, 11, 10),
//   },
//   {
//     title: 'Conference',
//     start: new Date(2023, 11, 20),
//     end: new Date(2023, 11, 23),
//   },
// ];

const BigCalendar = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [userTeams, setUserTeams] = useState([]);

  const { userData } = useContext(AppContext) as IAppContext;

  const transformTeamDataForCalendar = (teamsData) => {
    return teamsData.map((team) => ({
      title: team.title,
      start: team.start,
      end: team.end,
    }));
  };

  useEffect(() => {
    const fetchUserTeams = async () => {
      const userTeamsArray = await getUserTeams(userData?.handle);
      setUserTeams(userTeamsArray);
      console.log(userTeams);
    };

    fetchUserTeams();
  }, [userData?.handle]);

  useEffect(() => {
    if (userTeams) {
      const userTeamsCallback = (teamsData: ITeam[]) => {
        const transformedEvents = transformTeamDataForCalendar(teamsData);
        setAllEvents(transformedEvents);
        console.log(transformedEvents);
        console.log(teamsData);
      };

      const unsubscribe = getAllTeamMeetings(userTeams, userTeamsCallback);

      return () => {
        unsubscribe();
      };
    }
  }, [userTeams]);

  return (
    <div className="flex items-center justify-center w-full h-screen p-20">
      {allEvents ? (
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor={(event) => {
            return new Date(event.start);
          }}
          endAccessor={(event) => {
            return new Date(event.end);
          }}
          style={{ width: '100%' }}
        />
      ) : (
        <p>Loading events...</p>
      )}
    </div>
  );
};

export default BigCalendar;
