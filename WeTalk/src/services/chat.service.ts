import {
  DataSnapshot,
  get,
  off,
  onValue,
  push,
  ref,
  set,
  update,
} from '@firebase/database';
import { db } from '../config/firebase-config';
import { Unsubscribe } from '@firebase/util';

export const SendMessage = async (
  chatId: string,
  message: string,
  sender: string
) => {
  const messageIdRef = push(ref(db, `chats/${chatId}/messages`));

<<<<<<< HEAD
  const messageId = messageIdRef.key;

  await set(ref(db, `chats/${chatId}/messages/${messageId}`), {
    message,
    sender,
    timestamp: Date.now(),
  });

  return messageId;
};

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
=======
  export const getChatMessages = async (chatId: string): Promise<MessageType[]> => {
    try {
      const dbRef = ref(db, `chat/${chatId}/messages`);
      const snapshot = await get(dbRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.keys(data || {}).map((key) => data[key]);
  
        return messagesArray;
      } else {
        console.warn("No messages found for chat:", chatId);
        return [];
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
>>>>>>> 1aee6fa5b18e113957666448c3f991d44e70baff
    }
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

<<<<<<< HEAD
export const CreateChat = async (
  chatName: string,
  members: string[],
  chatId: string
) => {
  try {
    await set(ref(db, `chats/${chatId}`), {
      chatName,
      chatId,
      members: [...members],
      createdOn: Date.now(),
      messages: [],
=======
  export const CreateChat = async (
    chatName: string,
    members: string[],
    chatId: string
  ) => {
    try {
        await set(ref(db, `chats/${chatId}`), {
          chatName,
          chatId,
          members: [...members],
          createdOn: Date.now(),
          messages: [],
        });
      } catch (error) {
        console.error('Error creating chat:', error);
      }
  
    members.forEach(async (userHandle) => {
      await set(ref(db, `users/${userHandle}/chats`), {
        chats: {
          [chatId]: true,
        },
      });
>>>>>>> 1aee6fa5b18e113957666448c3f991d44e70baff
    });
  } catch (error) {
    console.error('Error creating chat:', error);
  }

  members.forEach(async (userHandle) => {
    await set(ref(db, `users/${userHandle}`), {
      chats: {
        [chatId]: true,
      },
    });
  });
};

export const onChatUpdate = (
  chatId: string,
  onChatDataUpdate: (chatData: any) => void,
  onMessagesUpdate: (messagesData: any) => void
): Unsubscribe => {
  const chatRef = ref(db, `chats/${chatId}`);
  const messagesRef = ref(db, `chats/${chatId}/messages`);

  const handleChatUpdate = (snapshot: DataSnapshot) => {
    const chatData = snapshot.val();
    onChatDataUpdate(chatData);
  };

  const handleMessagesUpdate = (snapshot: DataSnapshot) => {
    const messagesData = snapshot.val();
    onMessagesUpdate(messagesData);
  };

  const chatUnsubscribe = onValue(chatRef, handleChatUpdate);
  const messagesUnsubscribe = onValue(messagesRef, handleMessagesUpdate);

  return () => {
    chatUnsubscribe();
    messagesUnsubscribe();
  };
};

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

export const getAllChats = async (): Promise<any[]> => {
  try {
    const chatRef = ref(db, 'chats');
    const chatSnapshot = await get(chatRef);

    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.val();
      const chatArray = Object.keys(chatData).map((chatId) => ({
        ...chatData[chatId],
      }));
      return chatArray;
    } else {
      throw new Error('Chats not found');
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

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
