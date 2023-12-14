import {
  DataSnapshot,
  get,
  onValue,
  push,
  ref,
  set,
  update,
} from '@firebase/database';
import { db } from '../config/firebase-config';
import { Unsubscribe } from '@firebase/util';
import {
  createChatAudioCallNotification,
  createChatNotification,
  createChatVideoCallNotification,
} from './notifications.service';
import { setUserStatus } from './users.service';
import { UserStatus } from '../common/status-enum';

// Sends a message to a specified chat and returns the message ID
export const SendMessage = async (
  chatId: string,
  message: string,
  sender: string
) => {
  const messageIdRef = push(ref(db, `chats/${chatId}/messages`));

  const messageId = messageIdRef.key;

  await set(ref(db, `chats/${chatId}/messages/${messageId}`), {
    message,
    sender,
    timestamp: Date.now(),
  });

  return messageId;
};

// Retrieves chat messages for a specified chat ID
export const getChatMessages = async (
  chatId: string
): Promise<MessageType[]> => {
  try {
    const dbRef = ref(db, `chat/${chatId}/messages`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const messagesArray = Object.keys(data || {}).map((key) => data[key]);

      return messagesArray;
    } else {
      console.warn('No messages found for chat:', chatId);
      return [];
    }
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

// Creates a new chat with a given name, members, and chat ID
export const CreateChat = async (
  creator: string,
  chatName: string,
  members,
  chatId: string
) => {
  const initialTypingStatus = members.reduce((acc, member) => {
    acc[member?.handle] = false;
    return acc;
  }, {});

  await set(ref(db, `chats/${chatId}`), {
    creator,
    chatName,
    chatId,
    members: [...members],
    typingStatus: initialTypingStatus,
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

  members.forEach(async (member) => {
    await set(ref(db, `users/${member.handle}/chats`), {
      chats: {
        [chatId]: true,
      },
    });
  });

  createChatNotification(
    creator,
    members
      .filter((member) => member.handle !== creator)
      .map((member) => member.handle),
    chatName,
    chatId
  );

  return getChatDataById(chatId);
};

// Retrieves chat data by ID
export const getChatDataById = async (chatId: string) => {
  const result = await get(ref(db, `chats/${chatId}`));
  if (!result.exists()) {
    throw new Error(`Chat with id ${chatId} does not exist!`);
  }
  const chat = result.val();
  chat.createdOn = new Date(chat.createdOn).valueOf();
  return chat;
};

// Adds a video room ID to a chat
export const addVideoRoomID = async (chatId: string, videoRoomId: string) => {
  if (chatId && videoRoomId) {
    const updateData = {
      [`chats/${chatId}/videoRoomInfo/videoRoomId`]: videoRoomId,
    };

    await update(ref(db), updateData);

    console.log('Video room created successfully!');
  }
};

// Adds an audio room ID to a chat
export const addAudioRoomID = async (chatId: string, audioRoomId: string) => {
  if (chatId && audioRoomId) {
    const updateData = {
      [`chats/${chatId}/audioRoomInfo/audioRoomId`]: audioRoomId,
    };

    await update(ref(db), updateData);

    console.log('Audio room created successfully!');
  }
};

// Subscribes to updates for a specified chat, including chat data and messages
export const onChatUpdate = (
  chatId: string,
  onChatDataUpdate: (chatData: any) => void,
  onMessagesUpdate: (messagesData: any) => void,
  onTypingStatusUpdate: (typingStatus: Record<string, boolean>) => void
): Unsubscribe => {
  const chatRef = ref(db, `chats/${chatId}`);
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const typingStatusRef = ref(db, `chats/${chatId}/typingStatus`);

  const handleChatUpdate = (snapshot: DataSnapshot) => {
    const chatData = snapshot.val();
    onChatDataUpdate(chatData);
  };

  const handleMessagesUpdate = (snapshot: DataSnapshot) => {
    const messagesData = snapshot.val();
    onMessagesUpdate(messagesData);
  };

  const handleTypingStatusUpdate = (snapshot: DataSnapshot) => {
    const typingStatus = snapshot.val();
    onTypingStatusUpdate(typingStatus);
  };

  const chatUnsubscribe = onValue(chatRef, handleChatUpdate);
  const messagesUnsubscribe = onValue(messagesRef, handleMessagesUpdate);
  const typingStatusUnsubscribe = onValue(
    typingStatusRef,
    handleTypingStatusUpdate
  );

  return () => {
    chatUnsubscribe();
    messagesUnsubscribe();
    typingStatusUnsubscribe();
  };
};

// Subscribes to updates for a specified chat and its messages
export const GetChat = (
  chatId: string,
  onChatsUpdate: (chatData: any) => void,
  onMessagesUpdate: (messagesData: any) => void
): Unsubscribe => {
  const chatRef = ref(db, `chats/${chatId}`);

  onValue(chatRef, (snapshot) => {
    const chatData = snapshot.val();
    onChatsUpdate(chatData);
  });

  const messagesRef = ref(db, `chats/${chatId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const messagesData = snapshot.val();
    onMessagesUpdate(messagesData);
  });

  return () => {};
};

// export const getAllChats = async (): Promise<any[]> => {
//   try {
//     const chatRef = ref(db, 'chats');
//     const chatSnapshot = await get(chatRef);

//     if (chatSnapshot.exists()) {
//       const chatData = chatSnapshot.val();
//       const chatArray = Object.keys(chatData).map((chatId) => ({
//         ...chatData[chatId],
//       }));
//       return chatArray;
//     } else {
//       throw new Error('Chats not found');
//     }
//   } catch (e) {
//     console.error(e);
//     throw e;
//   }
// };

// Retrieves all chats and invokes a callback with the chat data
export const getAllChats = (callback: (chatsArray) => void) => {
  const chatsRef = ref(db, 'chats');

  const unsubscribe = onValue(chatsRef, (snapshot) => {
    const chatsData = snapshot.val();
    const chatsArray = Object.values(chatsData || {}).map(
      (chatData) => chatData
    );
    callback(chatsArray);
  });

  return unsubscribe;
};

// Registers a callback for updates to all chats
export const registerChatsUpdate = (callback: (chats: any) => void) => {
  const chatsRef = ref(db, 'chats');

  const handleUpdate = (snapshot: DataSnapshot) => {
    const chatsData = snapshot.val();
    const updatedChats = Object.keys(chatsData).map((chatId) => ({
      ...chatsData[chatId],
    }));

    callback(updatedChats);
  };

  const unsubscribe = onValue(chatsRef, handleUpdate);

  return unsubscribe;
};

export const getChatAudioRoomParticipants = async (chatId: string) => {
  const chatAudioRoomParticipantsRef = ref(
    db,
    `chats/${chatId}/audioRoomInfo/audioRoomParticipants`
  );

  const audioRoomParticipantsSnapshot = await get(chatAudioRoomParticipantsRef);
  return audioRoomParticipantsSnapshot.val();
};

export const addChatAudioRoomParticipant = async (
  chatId: string,
  participant: string
) => {
  if (chatId && participant) {
    const audioRoomParticipants = await getChatAudioRoomParticipants(chatId);
    const chatData = await getChatDataById(chatId);

    const updateParticipants: { [key: string]: any } = {};

    if (!audioRoomParticipants) {
      updateParticipants[
        `chats/${chatId}/audioRoomInfo/audioRoomParticipants/${participant}`
      ] = 'host';
      createChatAudioCallNotification(
        participant,
        chatData.members
          .filter(
            (member: { [key: string]: any }) => member.handle !== participant
          )
          .map((member: { [key: string]: any }) => member.handle),
        chatData.chatName,
        chatId
      );
      SendMessage(
        chatId,
        `${participant} has started an audio call`,
        participant
      );
    } else {
      updateParticipants[
        `chats/${chatId}/audioRoomInfo/audioRoomParticipants/${participant}`
      ] = 'participant';
    }

    setUserStatus(participant, UserStatus.BUSY.toLocaleLowerCase());

    await update(ref(db), updateParticipants);

    console.log('Video room status updated successfully!');
  }
};

export const deleteChatAudioRoomParticipant = async (
  chatId: string,
  participant: string
) => {
  if (chatId && participant) {
    const audioRoomParticipants = await getChatAudioRoomParticipants(chatId);

    const updateParticipants: { [key: string]: any } = {};
    updateParticipants[
      `chats/${chatId}/audioRoomInfo/audioRoomParticipants/${participant}`
    ] = null;

    if (Object.keys(audioRoomParticipants).length === 1) {
      SendMessage(
        chatId,
        `${participant} has ended an audio call`,
        participant
      );
    }

    setUserStatus(participant, UserStatus.ONLINE.toLocaleLowerCase());

    await update(ref(db), updateParticipants);

    console.log('Audio room status updated successfully!');
  }
};

export const getChatVideoRoomParticipants = async (chatId: string) => {
  const chatVideoRoomParticipantsRef = ref(
    db,
    `chats/${chatId}/videoRoomInfo/videoRoomParticipants`
  );

  const videoRoomParticipantsSnapshot = await get(chatVideoRoomParticipantsRef);
  return videoRoomParticipantsSnapshot.val();
};

export const addChatVideoRoomParticipant = async (
  chatId: string,
  participant: string
) => {
  if (chatId && participant) {
    const videoRoomParticipants = await getChatVideoRoomParticipants(chatId);
    const chatData = await getChatDataById(chatId);

    const updateParticipants: { [key: string]: any } = {};

    if (!videoRoomParticipants) {
      updateParticipants[
        `chats/${chatId}/videoRoomInfo/videoRoomParticipants/${participant}`
      ] = 'host';
      createChatVideoCallNotification(
        participant,
        chatData.members
          .filter(
            (member: { [key: string]: any }) => member.handle !== participant
          )
          .map((member: { [key: string]: any }) => member.handle),
        chatData.chatName,
        chatId
      );
      SendMessage(
        chatId,
        `${participant} has started a video call`,
        participant
      );
    } else {
      updateParticipants[
        `chats/${chatId}/videoRoomInfo/videoRoomParticipants/${participant}`
      ] = 'participant';
    }

    setUserStatus(participant, UserStatus.BUSY.toLocaleLowerCase());

    await update(ref(db), updateParticipants);

    console.log('Video room status updated successfully!');
  }
};

export const deleteChatVideoRoomParticipant = async (
  chatId: string,
  participant: string
) => {
  if (chatId && participant) {
    const videoRoomParticipants = await getChatVideoRoomParticipants(chatId);

    const updateParticipants: { [key: string]: any } = {};
    updateParticipants[
      `chats/${chatId}/videoRoomInfo/videoRoomParticipants/${participant}`
    ] = null;

    if (Object.keys(videoRoomParticipants).length === 1) {
      SendMessage(chatId, `${participant} has ended a video call`, participant);
    }

    setUserStatus(participant, UserStatus.ONLINE.toLocaleLowerCase());

    await update(ref(db), updateParticipants);

    console.log('Video room status updated successfully!');
  }
};
