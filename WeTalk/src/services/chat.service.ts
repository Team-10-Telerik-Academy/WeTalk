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
export const CreateChat = async (chatName: string, members, chatId: string) => {
  const initialTypingStatus = members.reduce((acc, member) => {
    acc[member?.handle] = false;
    return acc;
  }, {});

  console.log(initialTypingStatus);

  await set(ref(db, `chats/${chatId}`), {
    chatName,
    chatId,
    members: [...members],
    typingStatus: initialTypingStatus,
    createdOn: Date.now(),
    messages: [],
    roomId: '',
    roomStatus: '',
  });

  members.forEach(async (member) => {
    await set(ref(db, `users/${member.handle}/chats`), {
      chats: {
        [chatId]: true,
      },
    });
  });

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

// Adds a room ID to a chat
export const addRoomID = async (chatId: string, roomId: string) => {
  if (chatId && roomId) {
    const updateData = {
      [`chats/${chatId}/roomId`]: roomId,
    };

    await update(ref(db), updateData);

    console.log('Room created successfully!');
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

export const setChatRoomStatus = async (chatId: string, status: string) => {
  if (chatId && status) {
    const updateStatus = {
      [`chats/${chatId}/roomStatus`]: status,
    };

    await update(ref(db), updateStatus);

    console.log('Room status updated successfully!');
  }
};
