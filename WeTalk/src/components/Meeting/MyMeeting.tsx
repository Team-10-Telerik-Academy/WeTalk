import { DyteButton, DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from './Loading';

const MyMeeting: React.FC = ({ setIsCallButtonClicked }) => {
  const { meeting } = useDyteMeeting();
  const { chatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    meeting.self.on('roomLeft', () => {
      console.log(chatId);
      setIsCallButtonClicked(false);
      navigate(`/home/chats/${chatId}`);
    });
  }, [meeting]);

  // const roomJoined = useDyteSelector((m) => m.self.roomJoined);

  // if (!roomJoined) {
  //   return (
  //     <div>
  //       <p>You haven't joined the room yet.</p>
  //       <DyteButton onClick={() => meeting.joinRoom()}>Join Room</DyteButton>
  //     </div>
  //   );
  // }

  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        bottom: '0',
        right: '0',
        left: '0',
      }}
    >
      <div className="absolute top-0 bottom-0 right-0 left-0"></div>
      {meeting ? <DyteMeeting mode="fill" meeting={meeting} /> : <Loading />}
    </div>
  );
};

export default MyMeeting;
