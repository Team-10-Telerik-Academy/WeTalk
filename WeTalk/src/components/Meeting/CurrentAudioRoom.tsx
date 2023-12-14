import React, { useContext, useEffect, useState } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import Loading from './Loading';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../../context/AuthContext';
import { IAppContext } from '../../common/types';
import { API_KEY, BASE_URL, ORGANIZATION_ID } from '../../common/dyte-api';
import MyAudio from './MyAudio';

const CurrentAudioRoom: React.FC = ({ setIsAudioCallButtonClicked }) => {
  const [meeting, initMeeting] = useDyteClient();
  const { audioRoomId } = useParams();
  const { userData } = useContext(AppContext) as IAppContext;
  const [authToken, setAuthToken] = useState<string>('');

  const encodedString = btoa(`${ORGANIZATION_ID}:${API_KEY}`);

  useEffect(() => {
    if (audioRoomId) {
      const joinRoomConfig = {
        method: 'POST',
        url: `${BASE_URL}/meetings/${audioRoomId}/participants`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedString}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        data: {
          name: `${userData?.firstName} ${userData?.lastName}`,
          picture: `https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp`,
          preset_name: 'audio_group_call',
          custom_participant_id: `${userData?.handle}`,
        },
      };

      axios
        .request(joinRoomConfig)
        .then((response) => {
          const dyteAuthToken = response.data.data.token;
          setAuthToken(dyteAuthToken);
          return dyteAuthToken;
        })
        .then((authToken) => {
          console.log('init audio room');
          if (authToken) {
            initMeeting({
              authToken: authToken,
              defaults: {
                audio: false,
                video: false,
              },
            });
          }
        })
        .catch(console.error);
    }
  }, []);

  return (
    <DyteProvider value={meeting} fallback={<Loading />}>
      <MyAudio />
    </DyteProvider>
  );
};

export default CurrentAudioRoom;
