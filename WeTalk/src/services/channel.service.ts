import {
  DataSnapshot,
  get,
  off,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import { db, imageDb } from '../config/firebase-config';
import { Unsubscribe } from '@firebase/util';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from '@firebase/storage';

export const createChannel = async (
  channelName: string,
  members: any[],
  channelId: string,
  teamName: string,
  owner: any
) => {
  const initialTypingStatus = members.reduce((acc, member) => {
    acc[member?.handle] = false;
    return acc;
  }, {});

  try {
    await set(ref(db, `channels/${channelId}`), {
      channelName,
      channelId,
      owner,
      members: [...members, owner],
      typingStatus: initialTypingStatus,
      teamName,
      createdOn: Date.now(),
      messages: [],
      audioRoomInfo: {
        audioRoomId: '',
        audioRoomParticipants: {},
      },
      videoRoomInfo: {
        videoRoomId: '',
        videoRoomParticipants: {},
      },
    });
  } catch (error) {
    console.error('Error creating channel:', error);
  }
  members.forEach(async (member) => {
    const userChannelsRef = ref(db, `users/${member.handle}/channels`);

    await update(userChannelsRef, {
      [channelId]: true,
    });
  });
};

export const createGeneralChannel = async (
  teamName: string,
  members: any[],
  channelId: string,
  owner: string
) => {
  try {
    // console.log(teamName);
    // console.log(channelId);
    // console.log(owner);
    // console.log(members);
    const create = await set(ref(db, `channels/${channelId}`), {
      teamName,
      channelName: 'general',
      channelId,
      owner,
      members: [owner, ...members],
      createdOn: Date.now(),
      messages: [],
    });

    return create;
  } catch (error) {
    console.error('Error creating channel:', error);
  }
  members.forEach(async (member) => {
    const userChannelsRef = ref(db, `users/${member.handle}/channels`);

    await update(userChannelsRef, {
      [channelId]: true,
    });
  });
};

export const getChannelByIdSecond = async (channelId: string) => {
  try {
    const channelData = await get(ref(db, `channels/${channelId}`));

    return channelData.val();
  } catch (error) {
    console.error('Error fetching channels by ID', error.message);
  }
};

export const deleteChannel = async (channelId: string) => {
  try {
    const channelSnapshot = await getChannelByIdSecond(channelId);
    const channelData = channelSnapshot.val();
    if (channelData) {
      await remove(ref(db, `teams/${channelId}`));
    }
  } catch (error) {
    console.error('Error deleting channel:', error);
  }
};

export const sendChannelMessage = async (
  channelId: string,
  message: string,
  sender: string
) => {
  const messageIdRef = push(ref(db, `channels/${channelId}/messages`));

  const messageId = messageIdRef.key;

  await set(ref(db, `channels/${channelId}/messages/${messageId}`), {
    message,
    sender,
    timestamp: Date.now(),
  });

  return messageId;
};

export const onChannelUpdate = (
  channelId: string,
  onChannelDataUpdate: (channelData: any) => void,
  onMessagesUpdate: (messagesData: any) => void,
  onTypingStatusUpdate: (typingStatus: Record<string, boolean>) => void
): Unsubscribe => {
  const channelRef = ref(db, `channels/${channelId}`);
  const messagesRef = ref(db, `channels/${channelId}/messages`);
  const typingStatusRef = ref(db, `channels/${channelId}/typingStatus`);

  const handleChannelUpdate = (snapshot: DataSnapshot) => {
    const channelData = snapshot.val();
    onChannelDataUpdate(channelData);
  };

  const handleMessagesUpdate = (snapshot: DataSnapshot) => {
    const messagesData = snapshot.val();
    onMessagesUpdate(messagesData);
  };
  const handleTypingStatusUpdate = (snapshot: DataSnapshot) => {
    const typingStatus = snapshot.val();
    onTypingStatusUpdate(typingStatus);
  };

  const channelUnsubscribe = onValue(channelRef, handleChannelUpdate);
  const messagesUnsubscribe = onValue(messagesRef, handleMessagesUpdate);
  const typingStatusUnsubscribe = onValue(
    typingStatusRef,
    handleTypingStatusUpdate
  );

  return () => {
    channelUnsubscribe();
    messagesUnsubscribe();
    typingStatusUnsubscribe();
  };
};

export const getChannelOwner = async (channelId: string) => {
  const channelOwnerRef = ref(db, `channels/${channelId}/owner`);
  const channelOwnerData = await get(channelOwnerRef);

  if (channelOwnerData.exists()) {
    return channelOwnerData.val();
  } else {
    return null;
  }
};

export const getChannelById = (
  channelId: string,
  callback: (channelData: any) => void
) => {
  const channelRef = ref(db, `channels/${channelId}`);
  const unsubscribe = onValue(channelRef, (snapshot: DataSnapshot) => {
    const channelData = snapshot.val();
    callback(channelData);
  });

  return unsubscribe;
};

export const GetChannel = (
  channelId: string,
  onChannelsUpdate: (channelData: any) => void,
  onMessagesUpdate: (messagesData: any) => void
): Unsubscribe => {
  const channelRef = ref(db, `channels/${channelId}`);

  onValue(channelRef, (snapshot) => {
    const channelData = snapshot.val();
    onChannelsUpdate(channelData);
  });

  const messagesRef = ref(db, `channels/${channelId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const messagesData = snapshot.val();
    onMessagesUpdate(messagesData);
  });

  return () => {};
};

export const sendMessage = async (
  channelId: string,
  message: string,
  sender: string,
  otherMembers: []
) => {
  const messageIdRef = push(ref(db, `channels/${channelId}/messages`));

  const messageId = messageIdRef.key;

  await set(ref(db, `channels/${channelId}/messages/${messageId}`), {
    messageId,
    message,
    sender,
    timestamp: Date.now(),
    type: 'message',
  });
  // Send the message to other members as well
  otherMembers.forEach(async (member) => {
    await set(
      ref(db, `chats/${channelId}/messages/${messageId}/seenBy/${member}`),
      false
    );
  });
  return messageId;
};

export const getChannelMessages = async (
  channelId: string
): Promise<MessageType[]> => {
  try {
    const dbRef = ref(db, `channels/${channelId}/messages`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const messagesArray = Object.keys(data || {}).map((key) => data[key]);

      return messagesArray;
    } else {
      console.warn('No messages found for channel:', channelId);
      return [];
    }
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    throw error;
  }
};

export const getAllChannels = (callback: (channelsArray) => void) => {
  const channelsRef = ref(db, 'channels');

  const unsubscribe = onValue(channelsRef, (snapshot) => {
    const channelsData = snapshot.val();
    const channelsArray = Object.values(channelsData || {}).map(
      (channelData) => channelData
    );
    callback(channelsArray);
  });

  return unsubscribe;
};

export const registerChannelsUpdate = (callback: (channels: any) => void) => {
  const channelsRef = ref(db, 'channels');

  const handleUpdate = (snapshot: DataSnapshot) => {
    const channelsData = snapshot.val();
    const updatedChannels = Object.keys(channelsData).map((channelId) => ({
      ...channelsData[channelId],
    }));

    callback(updatedChannels);
  };

  const unsubscribe = onValue(channelsRef, handleUpdate);

  return unsubscribe;
};

export const lastMessageSentByUser = (
  messages: MessageType[],
  userHandle: string
) => {
  const lastMessageSentByUser = messages
    .filter((message) => message.sender === userHandle)
    .reduce((lastMessage, message) =>
      message.timestamp > lastMessage.timestamp ? message : lastMessage
    );

  return lastMessageSentByUser;
};

export const getLastMessage = (
  channelId: string,
  callback: (lastMessage: IMessageType | null) => void
) => {
  const messagesRef = ref(db, `channels/${channelId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    if (messages) {
      const messageArray = Object.values(messages);
      const lastMessage = messageArray.reduce((prevMessage, currentMessage) =>
        currentMessage.timestamp > prevMessage.timestamp
          ? currentMessage
          : prevMessage
      );

      callback(lastMessage);
    } else {
      callback(null);
    }
  });
};

export const updateMessageStatusToSeen = async (
  channelId: string,
  messageId: string
) => {
  try {
    const messageRef = ref(db, `channels/${channelId}/messages/${messageId}`);
    const snapshot = await get(messageRef);

    if (snapshot.exists()) {
      const messageData = snapshot.val();

      set(messageRef, { ...messageData, status: 'seen' });

      console.log(`Message status updated to 'seen' for message ${messageId}`);
    } else {
      console.log(`Message not found for id ${messageId}`);
    }
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

//   export const findChannelByMembers = async (members) => {
//     try {
//       const channelsRef = ref(db, "channels");
//       const channelsSnapshot = await get(channelsRef);

//       if (channelsSnapshot.exists()) {
//         const channels = channelsSnapshot.val();

//         const existingChannelId = Object.keys(channels).find((channelId) => {
//           const channelMembers = channels[channelId].members;
//           return (
//             channelMembers.length === members.length &&
//             members.every((member) => channelMembers.includes(member))
//           );
//         });

//         if (existingChannelId) {
//           return {
//             channelId: existingChannelId,
//             ...channels[existingChannelId],
//           };
//         }
//       }

//       return null;
//     } catch (error) {
//       console.error("Error finding channel by members:", error);
//       throw error;
//     }
//   };

// export const findChannelByTeamName = async (teamName) => {
//   try {
//     const channelsRef = ref(db, "channels");

//     const unsubscribe = onValue(channelsRef, (snapshot) => {
//       const channels = snapshot.val();

//       if (channels) {
//         const filteredChannels = Object.values(channels).filter((element) => {
//           return element.teamName === teamName;
//         });
//         return filteredChannels;
//       }
//       return unsubscribe;
//     });
//   } catch (error) {
//     console.error("Error finding channel by team name:", error);

//   }
// };

export const findChannelByTeamName = async (teamName) => {
  try {
    const channelsSnapshot = await get(ref(db, 'channels'));

    if (channelsSnapshot.exists()) {
      const channels = channelsSnapshot.val();
      //console.log(Object.values(channels));

      const filteredChannels = Object.values(channels).filter((element) => {
        return element.teamName === teamName;
      });
      return filteredChannels;
    }
  } catch (error) {
    console.error('Error finding channel by team name:', error);
  }
};

export const getAllChannelsInTeam = (
  teamName: string,
  callback: (channelsArray) => void
) => {
  const channelsRef = ref(db, 'channels');

  const unsubscribe = onValue(channelsRef, async () => {
    const channelsSnapshot = await get(ref(db, 'channels'));

    if (channelsSnapshot.exists()) {
      const channels = channelsSnapshot.val();

      const filteredChannels = Object.values(channels).filter((element) => {
        return element.teamName === teamName;
      });

      callback(filteredChannels);
    }
  });

  return unsubscribe;
};

// export const getAllChannelsInTeam = (teamName: string, callback: (channelsArray) => void) => {
//   const channelsRef = ref(db, 'channels');

//   const unsubscribe = onValue(channelsRef, (snapshot) => {
//     const channelsData = snapshot.val();

//     const filteredChannels = Object.values(channelsData).filter((element) => {
//       return element.teamName === teamName;
//     });

//     const channelsSnapshot = await get(ref(db, "channels"));

//     if (channelsSnapshot.exists()) {
//       const channels = channelsSnapshot.val();

//       const filteredChannels = Object.values(channels).filter((element) => {
//         return element.teamName === teamName && element.members.includes(userData.handle);
//       });

//       callback(filteredChannels);
//     }
//   });

//   return unsubscribe;
// };

export const sendGiphyUrl = async (
  channelId: string,
  giphyUrl: string,
  sender: string,
  otherMembers: []
) => {
  try {
    const messageIdRef = push(ref(db, `channels/${channelId}/messages`));
    const messageId = messageIdRef.key;

    await set(ref(db, `channels/${channelId}/messages/${messageId}`), {
      messageId,
      message: giphyUrl,
      sender,
      timestamp: Date.now(),
      status: 'delivered',
      type: 'file',
    });

    otherMembers.forEach(async (member) => {
      await set(
        ref(db, `channels/${channelId}/messages/${messageId}/seenBy/${member}`),
        false
      );
    });

    return messageId;
  } catch (error) {
    console.error('Error sending Giphy URL:', error);
    throw error;
  }
};

export const sendFile = async (
  channelId: string,
  file: File,
  sender: string,
  otherMembers: []
) => {
  try {
    const storageReference = storageRef(
      imageDb,
      `channels/${channelId}/files/${file.name}`
    );
    await uploadBytes(storageReference, file);

    const downloadURL = await getDownloadURL(storageReference);

    const messageIdRef = push(ref(db, `channels/${channelId}/messages`));
    const messageId = messageIdRef.key;

    await set(ref(db, `channels/${channelId}/messages/${messageId}`), {
      messageId,
      message: downloadURL,
      sender,
      timestamp: Date.now(),
      status: 'delivered',
      type: 'file',
    });

    otherMembers.forEach(async (member) => {
      await set(
        ref(db, `channels/${channelId}/messages/${messageId}/seenBy/${member}`),
        false
      );
    });

    return messageId;
  } catch (error) {
    console.error('Error sending file:', error);
    throw error;
  }
};

export const addRoomIDChannel = async (channelId: string, roomId: string) => {
  if (channelId && roomId) {
    const updateData = {
      [`channels/${channelId}/roomId`]: roomId,
    };

    await update(ref(db), updateData);

    console.log('Room created successfully!');
  }
};

export const setAllMessagesToSeenChannel = async (channelId, handle) => {
  try {
    const channelRef = ref(db, `channels/${channelId}/messages`);
    const messageSnapshot = await get(channelRef);

    if (messageSnapshot.exists()) {
      const messages = messageSnapshot.val();
      const updatedMessages = { ...messages };

      Object.keys(updatedMessages).forEach((messageId) => {
        const message = updatedMessages[messageId];
        const { [handle]: currentHandleSeen, ...restSeenBy } =
          message.seenBy || {};

        if (message.sender !== handle && message.seenBy[handle] === false) {
          message.seenBy = {
            ...restSeenBy,
            [handle]: true,
          };

          console.log(`Message ${messageId} marked as seen for ${handle}`);
          console.log('Updated message:', message);
        }
      });

      await set(channelRef, updatedMessages);
    } else {
      console.log(`No messages found in chat ${channelId}`);
    }
  } catch (error) {
    console.error('Error updating messages:', error);
  }
};
