import {
  faCommentDots,
  faEnvelope,
  faEnvelopeOpen,
  faPeopleGroup,
  faPhone,
  faTrash,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const SingleNotification = ({
  notification,
  onNotificationClick,
  onDeleteNotification,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`px-5 py-3 cursor-pointer ${
          notification.reviewed ? 'bg-primary bg-opacity-5' : 'bg-red-500'
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-start gap-4">
            <FontAwesomeIcon
              icon={
                notification.content.includes('team')
                  ? faPeopleGroup
                  : notification.content.includes('chat')
                  ? faCommentDots
                  : notification.content.includes('video')
                  ? faVideo
                  : faPhone
              }
              size="xl"
              className={`${
                notification.reviewed ? 'text-green-500' : 'text-secondary'
              }`}
            />
            <div className="flex flex-col items-start">
              <div
                className={`font-bold text-sm ${
                  notification.reviewed ? 'text-primary' : 'text-secondary'
                }`}
                onClick={() => navigate(notification.path)}
              >
                {notification.content}
              </div>
              <div
                className={`text-sm ${
                  notification.reviewed
                    ? 'text-primary text-opacity-50'
                    : 'text-secondary'
                }`}
              >
                {new Date(notification.createdOn).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <div>
              {notification.reviewed ? (
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="font-bold text-sm text-primary
                hover:scale-110"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faEnvelopeOpen}
                  className="font-bold text-sm text-secondary
                hover:scale-110"
                  onClick={() => onNotificationClick(notification)}
                />
              )}
            </div>
            <div>
              <FontAwesomeIcon
                icon={faTrash}
                className={`font-bold text-sm ${
                  notification.reviewed ? 'text-primary' : 'text-secondary'
                } hover:scale-110`}
                onClick={() => onDeleteNotification(notification)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleNotification;
