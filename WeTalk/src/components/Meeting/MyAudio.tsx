import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';
import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from './Loading';
import AppContext from '../../context/AuthContext';
import { IAppContext } from '../../common/types';
import {
  addChatAudioRoomParticipant,
  deleteChatAudioRoomParticipant,
  getChatAudioRoomParticipants,
} from '../../services/chat.service';

const MyAudio: React.FC = () => {
  const { meeting } = useDyteMeeting();
  const { chatId } = useParams();
  const navigate = useNavigate();

  const { userData } = useContext(AppContext) as IAppContext;

  useEffect(() => {
    const handleRoomLeft = async () => {
      try {
        const latestAudioRoomStatus = await getChatAudioRoomParticipants(
          chatId!
        );

        if (Object.keys(latestAudioRoomStatus).length > 0) {
          deleteChatAudioRoomParticipant(chatId!, userData?.handle);
        }

        console.log('left audio call');
        navigate(`/home/chats/${chatId}`);
      } catch (error) {
        console.error('Error updating audio room status:', error);
      }
    };

    const handleRoomJoined = async () => {
      try {
        // const latestAudioRoomStatus = await getChatAudioRoomParticipants(
        //   chatId!
        // );

        addChatAudioRoomParticipant(chatId!, userData?.handle);

        console.log('joined audio call');
      } catch (error) {
        console.error('Error updating audio from status:', error);
      }
    };

    const handleUnload = async () => {
      // This event is triggered when the user closes the browser/tab
      console.log('User is leaving the page...');
      await handleRoomLeft();
    };

    if (meeting) {
      meeting.self.on('roomLeft', handleRoomLeft);
      meeting.self.on('roomJoined', handleRoomJoined);
    }

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      if (meeting) {
        meeting.self.off('roomLeft', handleRoomLeft);
        meeting.self.off('roomJoined', handleRoomJoined);
      }

      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [meeting, chatId, navigate, userData?.handle]);

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

export default MyAudio;
