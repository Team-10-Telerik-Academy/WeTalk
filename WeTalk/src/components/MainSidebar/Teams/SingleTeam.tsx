import { useState, useEffect } from 'react';
import { getTeamByTeamName } from '../../../services/teams.service';
import SingleTeamView from '../../../views/MainSidebar/Teams/SingleTeamView';
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
  users: IUserData[];
};
 
const SingleTeam: React.FC<ISingleTeamProps> = ({
  teamName,
  onDeleteTeam,
  onRemoveMember,
  onAddMembersToTeam,
  onSaveTeamName,
  users,
}) => {
  const [teamData, setTeamData] = useState<ITeam | null>(null);
 
  useEffect(() => {
    const fetchTeamData = () => {
      try {
        getTeamByTeamName(teamName, (teamSnapshot) => {
          if (teamSnapshot && teamSnapshot.exists()) {
            const teamData = teamSnapshot.val();
            setTeamData(teamData);
            console.log('team data fetched');
          }
        });
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };
 
    fetchTeamData();
  }, [teamName]);
 
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


// import { useState, useEffect } from 'react';
// import { getTeamByTeamName } from '../../../services/teams.service';
// import SingleTeamView from '../../../views/MainSidebar/Teams/SingleTeamView';
// import { ITeam, IUserData } from '../../../common/types';

// type ISingleTeamProps = {
//   teamName: string;
//   onDeleteTeam: (teamName: string, owner: string) => void;
//   onRemoveMember: (
//     teamName: string,
//     owner: string,
//     memberToRemove: string
//   ) => void;
//   onAddMembersToTeam: (teamName: string, members: string[]) => void;
//   onSaveTeamName: (teamData: ITeam, newName: string) => void;
//   users: IUserData[];
// };

// const SingleTeam: React.FC<ISingleTeamProps> = ({
//   teamName,
//   onDeleteTeam,
//   onRemoveMember,
//   onAddMembersToTeam,
//   onSaveTeamName,
//   users,
// }) => {
//   const [teamData, setTeamData] = useState<ITeam | null>(null);

//   useEffect(() => {
//     const fetchTeamData = () => {
//       try {
//         getTeamByTeamName(teamName, (teamSnapshot) => {
//           if (teamSnapshot && teamSnapshot.exists()) {
//             const teamData = teamSnapshot.val();
//             setTeamData(teamData);
//             console.log(teamData);
//           }
//         });
//       } catch (error) {
//         console.error('Error fetching team data:', error);
//       }
//     };

//     fetchTeamData();
//   }, [teamName]);

//   if (!teamData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <SingleTeamView
//         teamData={teamData}
//         onDeleteTeam={onDeleteTeam}
//         onRemoveMember={onRemoveMember}
//         users={users}
//         onAddMembersToTeam={onAddMembersToTeam}
//         onSaveTeamName={onSaveTeamName}
//       />
//     </>
//   );
// };

// export default SingleTeam;
