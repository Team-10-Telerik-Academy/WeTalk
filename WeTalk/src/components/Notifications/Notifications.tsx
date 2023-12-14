import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AuthContext';
import { IAppContext } from '../../common/types';
import {
  deleteNotification,
  getNotifications,
  setNotificationToReviewed,
} from '../../services/notifications.service';
import SingleNotification from './SingleNotification';

const Notifications: React.FC = ({
  isNotificationsModalOpen,
  openNotificationsModal,
  closeNotificationsModal,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [notified, setNotified] = useState(false);

  const { userData } = useContext(AppContext) as IAppContext;

  const handleClickNotification = (notification) => {
    setNotificationToReviewed(userData?.handle!, notification.id);
  };

  const handleDeleteNotification = (notification) => {
    deleteNotification(userData?.handle!, notification.id);
  };

  useEffect(() => {
    // Update the notified state based on the notifications array
    setNotified(notifications.some((notification) => !notification.reviewed));
  }, [notifications, notified]);

  useEffect(() => {
    const notificationCallback = (notifications) => {
      setNotifications(notifications);
      console.log('notifications fetched');
    };

    const unsubscribe = getNotifications(
      userData?.handle,
      notificationCallback
    );

    return () => {
      unsubscribe();
    };
  }, [userData?.handle]);

  const notificationsList = notifications.map((notification) => (
    <div key={notification.id}>
      <SingleNotification
        notification={notification}
        onNotificationClick={handleClickNotification}
        onDeleteNotification={handleDeleteNotification}
      />
    </div>
  ));

  return (
    <>
      <div className="flex flex-col text-center items-center justify-center">
        <a
          href="#"
          className="p-1 relative inline-block text-gray-300 focus:outline-nones transition-colors duration-200 rounded-lg hover:text-secondary hover:scale-110"
          title="ACTIVITY"
          onClick={openNotificationsModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {notified && (
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-secondary bg-red-500 rounded-full -top-2 -end-2 dark:border-gray-900">
              {
                notifications.filter(
                  (notification) => notification.reviewed === false
                ).length
              }
            </div>
          )}
        </a>
        <span className="text-gray-300 text-xs tracking-tight">Activity</span>
        {isNotificationsModalOpen && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50">
            <div className="flex items-center justify-center min-h-screen xl:py-10">
              <div className="bg-white w-full md:w-1/2 lg:w-1/3 2xl:w-1/4 pt-6 rounded shadow-lg animate-jump-in">
                <div className="flex flex-col items-center justify-center mb-8">
                  <h2 className="text-xl text-primary font-extrabold text-center uppercase">
                    Notifications
                  </h2>
                  <hr className="w-12 border-t-4 border-accent mt-2" />
                </div>
                <div className="space-y-2 p-2 rounded mb-10">
                  {notifications.length > 0
                    ? notificationsList
                    : 'You currently have no notifications!'}
                </div>
                <div className="flex items-center justify-center">
                  <button
                    className="bg-accent text-primary font-bold px-4 py-2 rounded hover:bg-primary hover:text-secondary w-full"
                    onClick={closeNotificationsModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
