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

const CurrentRoom: React.FC = ({ setIsCallButtonClicked }) => {
  const [meeting, initMeeting] = useDyteClient();
  // const { currentRoom, authToken } = useContext(RoomContext);
  const { roomId } = useParams();
  const { userData } = useContext(AppContext) as IAppContext;
  const [authToken, setAuthToken] = useState<string>('');
  // const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const encodedString = btoa(`${ORGANIZATION_ID}:${API_KEY}`);

  useEffect(() => {
    if (roomId) {
      // const roomConfig = {
      //   method: 'GET',
      //   url: `${BASE_URL}/meetings/${roomId}`,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Basic ${encodedString}`,
      //   },
      // };
      // axios
      //   .request(roomConfig)
      //   .then((response) => {
      //     const dyteRoom = response.data;
      //     console.log(dyteRoom);
      //     setCurrentRoom(dyteRoom);
      //   })
      //   .then(() => {
      //     console.log('Room retrieved');
      const joinRoomConfig = {
        method: 'POST',
        url: `${BASE_URL}/meetings/${roomId}/participants`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedString}`,
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          name: `${userData?.firstName} ${userData?.lastName}`,
          picture: `https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp`,
          preset_name: 'group_call_host',
          custom_participant_id: `${userData?.handle}`,
        },
      };

      axios
        .request(joinRoomConfig)
        .then((response) => {
          const dyteAuthToken = response.data.data.token;
          // console.log('Token:', response.data.data.token);
          setAuthToken(dyteAuthToken);
          return dyteAuthToken;
        })
        .then((authToken) => {
          console.log(roomId);
          console.log('Auth token:', authToken);
          // console.log('Current room:', currentRoom);
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
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <DyteProvider value={meeting} fallback={<Loading />}>
      <MyMeeting setIsCallButtonClicked={setIsCallButtonClicked} />
    </DyteProvider>
  );
};

export default CurrentRoom;
