import { DataSnapshot, onValue, push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createTeamNotification = (
  creator: string,
  members: any[],
  teamName: string
) => {
  members.map(async (member) => {
    const result = await push(ref(db, `notifications/${member.handle}`), {
      content: `${creator} added you to team ${teamName}.`,
      path: 'teams',
      createdOn: Date.now().valueOf(),
      reviewed: false,
    });
    if (result) {
      update(ref(db), {
        [`notifications/${member.handle}/${result?.key}/id`]: result?.key,
      });
    }
  });
};

export const getNotifications = (
  handle: string,
  callback: (teamNotifications: DataSnapshot[] | null) => void
) => {
  const teamsRef = ref(db, `notifications/${handle}`);

  const unsubscribe = onValue(teamsRef, (snapshot) => {
    callback(snapshot.exists() ? Object.values(snapshot.val()) : []);
  });

  return unsubscribe;
};

export const setNotificationToReviewed = async (handle: string, id: string) => {
  return await update(ref(db), {
    [`notifications/${handle}/${id}/reviewed`]: true,
  });
};

export const createChatNotification = (
  creator: string,
  members: string[],
  chatName: string,
  chatId: string
) => {
  members.map(async (member) => {
    const result = await push(ref(db, `notifications/${member}`), {
      content: `${creator} has started a chat with you - ${chatName}.`,
      path: `chats/${chatId}`,
      createdOn: Date.now().valueOf(),
      reviewed: false,
    });
    if (result) {
      update(ref(db), {
        [`notifications/${member}/${result?.key}/id`]: result?.key,
      });
    }
  });
};

export const createChatVideoCallNotification = (
  creator: string,
  members: string[],
  chatName: string,
  chatId: string
) => {
  members.map(async (member) => {
    const result = await push(ref(db, `notifications/${member}`), {
      content: `${creator} has started a video call - ${chatName}.`,
      path: `chats/${chatId}`,
      createdOn: Date.now().valueOf(),
      reviewed: false,
    });
    if (result) {
      update(ref(db), {
        [`notifications/${member}/${result?.key}/id`]: result?.key,
      });
    }
  });
};

export const createChatAudioCallNotification = (
  creator: string,
  members: string[],
  chatName: string,
  chatId: string
) => {
  members.map(async (member) => {
    const result = await push(ref(db, `notifications/${member}`), {
      content: `${creator} has started an audio call - ${chatName}.`,
      path: `chats/${chatId}`,
      createdOn: Date.now().valueOf(),
      reviewed: false,
    });
    if (result) {
      update(ref(db), {
        [`notifications/${member}/${result?.key}/id`]: result?.key,
      });
    }
  });
};

export const deleteNotification = async (
  user: string,
  notificationId: string
) => {
  const updateUserNotifications: { [key: string]: any } = {};
  updateUserNotifications[`notifications/${user}/${notificationId}`] = null;

  await update(ref(db), updateUserNotifications);

  console.log('Notifications updated successfully!');
};
