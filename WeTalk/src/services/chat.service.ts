import {
  DataSnapshot,
  get,
  onValue,
  push,
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
import { ref as dbDatabaseRef } from '@firebase/database';
import { imageDb } from '../config/firebase-config';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from '@firebase/storage';
import { v4 } from 'uuid';

// Sends a message to a specified chat and returns the message ID
export const SendMessage = async (
  chatId: string,
  message: string,
  sender: string,
  otherMembers: []
) => {
  const messageIdRef = push(dbDatabaseRef(db, `chats/${chatId}/messages`));

  const messageId = messageIdRef.key;

  await set(dbDatabaseRef(db, `chats/${chatId}/messages/${messageId}`), {
    messageId,
    message,
    sender,
    timestamp: Date.now(),
    type: 'message',
  });

  // Send the message to other members as well
  otherMembers.forEach(async (member) => {
    await set(
      dbDatabaseRef(
        db,
        `chats/${chatId}/messages/${messageId}/seenBy/${member}`
      ),
      false
    );
  });

  return messageId;
};

export const sendFile = async (
  chatId: string,
  file: File,
  sender: string,
  otherMembers: []
) => {
  try {
    const fileName = `${file.name}_${v4()}`;
    const storageReference = storageRef(
      imageDb,
      `chats/${chatId}/files/${fileName}`
    );
    await uploadBytes(storageReference, file);

    const downloadURL = await getDownloadURL(storageReference);

    const messageIdRef = push(dbDatabaseRef(db, `chats/${chatId}/messages`));
    const messageId = messageIdRef.key;

    await set(dbDatabaseRef(db, `chats/${chatId}/messages/${messageId}`), {
      messageId,
      message: downloadURL,
      sender,
      timestamp: Date.now(),
      status: 'delivered',
      type: 'file',
      fileName,
    });

    otherMembers.forEach(async (member) => {
      await set(
        dbDatabaseRef(
          db,
          `chats/${chatId}/messages/${messageId}/seenBy/${member}`
        ),
        false
      );
    });

    return messageId;
  } catch (error) {
    console.error('Error sending file:', error);
    throw error;
  }
};

export const sendGiphyUrl = async (
  chatId: string,
  giphyUrl: string,
  sender: string,
  otherMembers: []
) => {
  try {
    const messageIdRef = push(dbDatabaseRef(db, `chats/${chatId}/messages`));
    const messageId = messageIdRef.key;

    await set(dbDatabaseRef(db, `chats/${chatId}/messages/${messageId}`), {
      messageId,
      message: giphyUrl,
      sender,
      timestamp: Date.now(),
      status: 'delivered',
      type: 'file',
    });

    otherMembers.forEach(async (member) => {
      await set(
        dbDatabaseRef(
          db,
          `chats/${chatId}/messages/${messageId}/seenBy/${member}`
        ),
        false
      );
    });

    return messageId;
  } catch (error) {
    console.error('Error sending Giphy URL:', error);
    throw error;
  }
};

// Retrieves chat messages for a specified chat ID
export const getChatMessages = async (
  chatId: string
): Promise<MessageType[]> => {
  try {
    const dbRef = dbDatabaseRef(db, `chat/${chatId}/messages`);
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
  members: any[],
  chatId: string
) => {
  const initialTypingStatus = members.reduce((acc, member) => {
    acc[member?.handle] = false;
    return acc;
  }, {});

  await set(dbDatabaseRef(db, `chats/${chatId}`), {
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
    const userChatsRef = dbDatabaseRef(db, `users/${member.handle}/chats`);

    // Use 'update' to add the new chat without overwriting existing chats
    await update(userChatsRef, {
      [chatId]: true,
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
  const result = await get(dbDatabaseRef(db, `chats/${chatId}`));
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

    await update(dbDatabaseRef(db), updateData);

    console.log('Video room created successfully!');
  }
};

// Adds an audio room ID to a chat
export const addAudioRoomID = async (chatId: string, audioRoomId: string) => {
  if (chatId && audioRoomId) {
    const updateData = {
      [`chats/${chatId}/audioRoomInfo/audioRoomId`]: audioRoomId,
    };

    await update(dbDatabaseRef(db), updateData);

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
  const chatRef = dbDatabaseRef(db, `chats/${chatId}`);
  const messagesRef = dbDatabaseRef(db, `chats/${chatId}/messages`);
  const typingStatusRef = dbDatabaseRef(db, `chats/${chatId}/typingStatus`);

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
  const chatRef = dbDatabaseRef(db, `chats/${chatId}`);

  onValue(chatRef, (snapshot) => {
    const chatData = snapshot.val();
    onChatsUpdate(chatData);
  });

  const messagesRef = dbDatabaseRef(db, `chats/${chatId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const messagesData = snapshot.val();
    onMessagesUpdate(messagesData);
  });

  return () => {};
};

// Retrieves all chats and invokes a callback with the chat data
export const getAllChats = (callback: (chatsArray) => void) => {
  const chatsRef = dbDatabaseRef(db, 'chats');

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
  const chatsRef = dbDatabaseRef(db, 'chats');

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

    await update(dbDatabaseRef(db), updateParticipants);

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

    await update(dbDatabaseRef(db), updateParticipants);

    console.log('Audio room status updated successfully!');
  }
};

export const getChatVideoRoomParticipants = async (chatId: string) => {
  const chatVideoRoomParticipantsRef = dbDatabaseRef(
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

    await update(dbDatabaseRef(db), updateParticipants);

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

    await update(dbDatabaseRef(db), updateParticipants);

    console.log('Video room status updated successfully!');
  }
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
  chatId: string,
  callback: (lastMessage: IMessageType | null) => void
) => {
  const messagesRef = dbDatabaseRef(db, `chats/${chatId}/messages`);

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
  chatId: string,
  messageId: string,
  userHandle: string
) => {
  try {
    const messageRef = dbDatabaseRef(
      db,
      `chats/${chatId}/messages/${messageId}`
    );
    const snapshot = await get(messageRef);

    if (snapshot.exists()) {
      const messageData = snapshot.val();
      const seenBy = messageData.seenBy || {};

      // Set the user's handle to true in seenBy
      seenBy[userHandle] = true;

      // Update the message with the modified seenBy field
      set(messageRef, { ...messageData, seenBy });

      console.log(`Message status updated to 'seen' for message ${messageId}`);
    } else {
      console.log(`Message not found for id ${messageId}`);
    }
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

export const findChatByMembers = async (members) => {
  try {
    const chatsRef = dbDatabaseRef(db, 'chats');
    const chatsSnapshot = await get(chatsRef);

    if (chatsSnapshot.exists()) {
      const chats = chatsSnapshot.val();

      const existingChatId = Object.keys(chats).find((chatId) => {
        const chatMembers = chats[chatId].members;
        console.log(chatMembers);

        // Check if every member in the provided array is present in the chat
        return members.every((member) => {
          return chatMembers.every(
            (chatMember) => chatMember.handle === member.handle
          );
        });
      });

      if (existingChatId) {
        return {
          chatId: existingChatId,
          ...chats[existingChatId],
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding chat by members:', error);
    throw error;
  }
};

export const getLastMessageSentByUser = (
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

export const setAllMessagesToSeen = async (chatId, handle) => {
  try {
    const chatRef = ref(db, `chats/${chatId}/messages`);
    const messageSnapshot = await get(chatRef);

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

      await set(chatRef, updatedMessages);
    } else {
      console.log(`No messages found in chat ${chatId}`);
    }
  } catch (error) {
    console.error('Error updating messages:', error);
  }
};
