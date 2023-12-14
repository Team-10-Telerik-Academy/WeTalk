import React, { useContext, useEffect, useState } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import MyMeeting from './MyMeeting';
import Loading from './Loading';
// import RoomContext from '../../context/RoomContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../../context/AuthContext';
import { IAppContext } from '../../common/types';
import { API_KEY, BASE_URL, ORGANIZATION_ID } from '../../common/dyte-api';

const CurrentVideoRoom: React.FC = () => {
  const [meeting, initMeeting] = useDyteClient();
  const { videoRoomId } = useParams();
  const { userData } = useContext(AppContext) as IAppContext;
  const [authToken, setAuthToken] = useState<string>('');

  const encodedString = btoa(`${ORGANIZATION_ID}:${API_KEY}`);

  useEffect(() => {
    if (videoRoomId) {
      const joinRoomConfig = {
        method: 'POST',
        url: `${BASE_URL}/meetings/${videoRoomId}/participants`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedString}`,
          'Access-Control-Allow-Headers': 'Authorization',
        },
        data: {
          name: `${userData?.firstName} ${userData?.lastName}`,
          picture: `https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp`,
          preset_name: 'group_call_participant',
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
          console.log('init chat room');
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
      <MyMeeting />
    </DyteProvider>
  );
};

export default CurrentVideoRoom;
