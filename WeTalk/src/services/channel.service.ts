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
  } from "firebase/database";
  import { db } from "../config/firebase-config";
  import { Unsubscribe } from "@firebase/util";
  
  export const createChannel = async (
    channelName: string,
    members: string[],
    channelId: string,
    teamName: string
  ) => {
    try {
      await set(ref(db, `channels/${channelId}`), {
        channelName,
        channelId,
        members: [...members],
        teamName,
        createdOn: Date.now(),
        messages: [],
      });
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };
  
  export const createGeneralChanel = async (
    teamName: string,
    members: string[],
    channelId: string
  ) => {
    try {
      await set(ref(db, `channels/${channelId}`), {
        teamName,
        channelName: "general",
        channelId,
        members: [...members],
        createdOn: Date.now(),
        messages: [],
      });
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };
  
  export const getChannelById = (channelId: string) => {
    return get(ref(db, `channels/${channelId}`));
  };
  
  export const deleteChannel = async (channelId: string) => {
    try {
      const channelSnapshot = await getChannelById(channelId);
      const channelData = channelSnapshot.val();
      if (channelData) {
        await remove(ref(db, `teams/${channelId}`));
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
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
    onMessagesUpdate: (messagesData: any) => void
  ): Unsubscribe => {
    const channelRef = ref(db, `channels/${channelId}`);
    const messagesRef = ref(db, `channels/${channelId}/messages`);
  
    const handleChannelUpdate = (snapshot: DataSnapshot) => {
      const channelData = snapshot.val();
      onChannelDataUpdate(channelData);
    };
  
    const handleMessagesUpdate = (snapshot: DataSnapshot) => {
      const messagesData = snapshot.val();
      onMessagesUpdate(messagesData);
    };
  
    const channelUnsubscribe = onValue(channelRef, handleChannelUpdate);
    const messagesUnsubscribe = onValue(messagesRef, handleMessagesUpdate);
  
    return () => {
      channelUnsubscribe();
      messagesUnsubscribe();
    };
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
  
  //   export const registerChatsUpdate = (callback: (chats: any) => void) => {
  //     const chatsRef = ref(db, "chats");
  
  //     const handleUpdate = (snapshot: DataSnapshot) => {
  //       const chatsData = snapshot.val();
  //       const updatedChats = Object.keys(chatsData).map((chatId) => ({
  //         ...chatsData[chatId],
  //       }));
  
  //       callback(updatedChats);
  //     };
  
  //     const unsubscribe = onValue(chatsRef, handleUpdate);
  
  //     return unsubscribe;
  //   };
  //----------------------------------------------------------------
  
  export const SendMessage = async (
    channelId: string,
    message: string,
    sender: string
  ) => {
    const messageIdRef = push(ref(db, `channels/${channelId}/messages`));
  
    const messageId = messageIdRef.key;
  
    await set(ref(db, `channels/${channelId}/messages/${messageId}`), {
      messageId,
      message,
      sender,
      timestamp: Date.now(),
      status: "delivered",
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
        console.warn("No messages found for channel:", channelId);
        return [];
      }
    } catch (error) {
      console.error("Error fetching channel messages:", error);
      throw error;
    }
  };
  
  export const getAllChannels = (callback: (channelsArray) => void) => {
    const channelsRef = ref(db, "channels");
  
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
    const channelsRef = ref(db, "channels");
  
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
  
        set(messageRef, { ...messageData, status: "seen" });
  
        console.log(`Message status updated to 'seen' for message ${messageId}`);
      } else {
        console.log(`Message not found for id ${messageId}`);
      }
    } catch (error) {
      console.error("Error updating message status:", error);
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
  
  export const findChannelByTeamName = async (teamName) => {
    try {
      const channelsSnapshot = await get(ref(db, "channels"));
  
      if (channelsSnapshot.exists()) {
        const channels = channelsSnapshot.val();
        //console.log(Object.values(channels));
  
        const filteredChannels = Object.values(channels).filter((element) => {
          return element.teamName === teamName;
        });
        return filteredChannels;
      }
    } catch (error) {
      console.error("Error finding channel by team name:", error);
    }
  };
  