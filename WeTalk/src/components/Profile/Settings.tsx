import { useContext, useEffect, useState } from 'react';
import { get, set, ref } from '@firebase/database';
import { db } from '../../config/firebase-config';
import AppContext from '../../context/AuthContext';
import { IAppContext } from '../../common/types';
import ThemeButton from '../ThemeButton/ThemeButton';
import PictureChange from './PictureChange';
import { Dropdown } from 'flowbite-react';
import { setUserStatus } from '../../services/users.service';
import { UserStatus } from '../../common/status-enum';
import Profile from './Profile';

const Settings = () => {
  const { userData } = useContext(AppContext) as IAppContext;

  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(
    userData?.firstName || ''
  );
  const [editedLastName, setEditedLastName] = useState(
    userData?.lastName || ''
  );
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(
    null
  );

  const displayStatus = (status: string, bg: string) => {
    return (
      <div className="inline-flex gap-2 items-center justify-center text-xs lg:text-sm">
        <div className={`rounded-full bg-${bg} h-2 w-2`}></div>
        {status}
      </div>
    );
  };

  const [currentUserStatus, setCurrentUserStatus] = useState(
    displayStatus('Online', 'success')
  );

  const handleChange = () => {
    setIsEditing(true);
    setEditedFirstName(userData?.firstName || '');
    setEditedLastName(userData?.lastName || '');
  };

  const handleSave = () => {
    const userHandle = userData?.handle;
    const dbRef = ref(db, 'users');

    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userDataRef = ref(db, `users/${userHandle}`);
        set(userDataRef, {
          ...users[userHandle!],
          firstName: editedFirstName,
          lastName: editedLastName,
        });
      }
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset the edited names to the current user data
    setEditedFirstName(userData?.firstName || '');
    setEditedLastName(userData?.lastName || '');
  };

  useEffect(() => {
    const userHandle = userData?.handle;
    console.log('user handle');
    console.log('user avatar');

    if (userHandle && profilePictureURL !== null) {
      const dbRef = ref(db, `users/${userHandle}`);

      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          set(dbRef, {
            ...users,
            imgUrl: profilePictureURL,
          });
        }
      });
    }
  }, [profilePictureURL, userData?.handle]);

  const handleStatusClick = async (
    handle: string,
    newStatus: string,
    status: string
  ) => {
    await setUserStatus(handle, newStatus);
    setCurrentUserStatus((prevStatus) => (prevStatus = status));
  };

  return (
    <>
      <a
        href="#"
        className="p-1.5 inline-block text-gray-300 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:text-secondary hover:scale-110"
        title="SETTINGS"
        onClick={() =>
          (
            document.getElementById('my_modal_1') as HTMLDialogElement
          )?.showModal()
        }
      >
        {/* <svg
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
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg> */}
        <Profile handle={userData?.handle!} />
      </a>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col bg-secondary justify-center gap-4">
          {/* Profile picture */}
          <PictureChange
            userData={userData}
            setProfilePictureURL={setProfilePictureURL}
            profilePictureURL={profilePictureURL}
          />

          {/* First Name Input */}
          <div className="flex flex-row justify-between items-center gap-2">
            <div className="flex justify-center items-center w-full gap-4">
              <div className="flex flex-col items-center justify-center">
                {isEditing ? (
                  <>
                    <label className="text-primary text-xs mb-1">
                      First Name:
                    </label>
                    <input
                      className="text-xl text-primary text-opacity-80 font-bold border-2 border-primary rounded py-1 px-2 w-32 text-center bg-secondary"
                      type="text"
                      value={editedFirstName}
                      onChange={(e) => setEditedFirstName(e.target.value)}
                    />
                  </>
                ) : (
                  <span className="font-bold text-primary text-3xl">
                    {userData?.firstName}
                  </span>
                )}
              </div>

              {/* Last Name Input */}
              <div className="flex flex-col items-center justify-center">
                {isEditing ? (
                  <>
                    <label className="text-primary text-xs mb-1">
                      Last Name:
                    </label>
                    <input
                      className="text-xl text-primary text-opacity-80 font-bold border-2 border-primary rounded py-1 px-2 w-32 text-center bg-secondary"
                      type="text"
                      value={editedLastName}
                      onChange={(e) => setEditedLastName(e.target.value)}
                    />
                  </>
                ) : (
                  <span className="font-bold text-primary text-3xl">
                    {userData?.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Buttons for Save, Cancel, and Change */}
            <div className="flex flex-col w-1/3 items-end">
              <div className="m-2">
                {isEditing ? (
                  <div className="flex flex-col">
                    <button
                      className="text-xs mb-2 text-sm text-secondary bg-primary p-2 rounded font-bold hover:underline border-2 border-primary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-xs text-sm text-secondary bg-primary p-2 rounded font-bold hover:underline border-2 border-primary"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-xs text-primary underline"
                    onClick={handleChange}
                  >
                    Change name
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Border */}
          <hr className="border mt-4" />

          <div className="flex justify-between items-center">
            <span className="flex gap-1 items-center justify-center">
              <span className="text-sm text-primary">Theme:</span>{' '}
              <ThemeButton />
            </span>
            {/* Status*/}
            <div className="flex items-center justify-center">
              <span className="text-sm text-primary">Status:</span>
              <button className="w-20 text-left bg-secondary text-primary font-bold p-2 rounded hover:text-primary">
                <Dropdown
                  label=""
                  dismissOnClick={false}
                  renderTrigger={() => <span>{currentUserStatus}</span>}
                >
                  <Dropdown.Item
                    onClick={() =>
                      handleStatusClick(
                        userData?.handle,
                        UserStatus.ONLINE.toLowerCase(),
                        displayStatus('Online', 'success')
                      )
                    }
                  >
                    <div className="inline-flex gap-2 justify-between items-center hover:bg-gray-100 text-xs lg:text-sm">
                      <div className="rounded-full bg-success h-2 w-2"></div>
                      Online
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      handleStatusClick(
                        userData?.handle,
                        UserStatus.OFFLINE.toLowerCase(),
                        displayStatus('Offline', 'gray-400')
                      )
                    }
                  >
                    <div className="inline-flex gap-2 justify-between items-center hover:bg-gray-100 text-xs lg:text-sm">
                      <div className="rounded-full bg-gray-400 h-2 w-2"></div>
                      Offline
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      handleStatusClick(
                        userData?.handle,
                        UserStatus.BUSY.toLowerCase(),
                        displayStatus('Busy', 'error')
                      )
                    }
                  >
                    <div className="inline-flex gap-2 justify-between items-center hover:bg-gray-100 text-xs lg:text-sm">
                      <div className="rounded-full bg-error h-2 w-2"></div>
                      Busy
                    </div>
                  </Dropdown.Item>
                </Dropdown>
              </button>
            </div>
            <form method="dialog">
              <button className="bg-accent text-primary font-bold px-4 py-2 rounded hover:bg-primary hover:text-secondary w-full">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Settings;
