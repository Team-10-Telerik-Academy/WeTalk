import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { IAppContext, ITeam } from '../../../common/types';
// import AppContext from '../../../context/AuthContext';
// import Status from '../../Profile/Status';
// import Profile from '../../Profile/Profile';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createMeeting } from '../../../services/meetings.service';
import { v4 } from 'uuid';
import { toast } from 'react-toastify';
import {
  MAX_MEETING_TITLE_LENGTH,
  MIN_MEETING_TITLE_LENGTH,
} from '../../../common/constants';

type IUser = {
  handle: string;
  firstName: string;
  lastName: string;
};

type MembersModalProps = {
  teamData: ITeam;
  users: IUser[];
  isOpen: boolean;
  onClose: () => void;
};

const ScheduleTeaMeeting: React.FC<MembersModalProps> = ({
  teamData,
  users,
  isOpen,
  onClose,
}) => {
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });

  const handleCreateEvent = () => {
    if (!newEvent.title) {
      toast.warning(`Please provide a meeting title!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (
      newEvent.title.length < MIN_MEETING_TITLE_LENGTH ||
      newEvent.title.length > MAX_MEETING_TITLE_LENGTH
    ) {
      toast.warning(
        `The event title must contain between ${MIN_MEETING_TITLE_LENGTH} and ${MAX_MEETING_TITLE_LENGTH} characters!`,
        {
          autoClose: 3000,
          className: 'font-bold',
        }
      );
      return;
    }

    if (!newEvent.start) {
      toast.warning(`Please provide a meeting start date!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (new Date(newEvent.start) < new Date()) {
      toast.warning(`Please select a start date that is not in the past!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!newEvent.end) {
      toast.warning(`Please provide a meeting end date!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (new Date(newEvent.end) < new Date()) {
      toast.warning(`Please select an end date that is not in the past!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    createMeeting(
      v4(),
      newEvent.title,
      teamData.members,
      newEvent.start,
      newEvent.end,
      teamData.teamName
    );
    setNewEvent({ title: '', start: '', end: '' });
    toast.success(`Successfully scheduled a meeting!`, {
      autoClose: 3000,
      className: 'font-bold',
    });
  };

  //   const { userData } = useContext(AppContext) as IAppContext;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen xl:py-10">
            <div className="bg-white w-full md:w-1/2 lg:w-1/3 2xl:w-1/4 pt-6 rounded shadow-lg animate-jump-in">
              <div className="flex flex-col items-center justify-center mb-8">
                <h2 className="text-xl text-primary font-extrabold text-center uppercase">
                  Add new Event
                </h2>
                <hr className="w-12 border-t-4 border-accent mt-2" />
              </div>
              {/* <div className="space-y-2 p-2 rounded mb-10">
                {teamData.members.map((member) => (
                  <div
                    key={member}
                    className="flex items-center justify-between border border-primary rounded p-2 hover:bg-primary hover:bg-opacity-5"
                  >
                    <div className="flex items-center py-1">
                      {users
                        .filter((user) => user.handle === member)
                        .map((user) => (
                          <>
                            <div className="flex gap-2 items-center">
                              <Profile handle={user.handle} />
                              <div
                                key={user.handle}
                                className="text-xs md:text-sm text-primary"
                              >
                                {user.firstName} {user.lastName} ({user.handle})
                              </div>
                            </div>
                            <span className="font-bold text-primary text-xs md:text-sm">
                              {member === teamData.owner && (
                                <FontAwesomeIcon
                                  icon={faCrown}
                                  className="text- cursor-pointer px-2 text-xs md:text-sm"
                                />
                              )}
                            </span>
                          </>
                        ))}
                    </div>
                    {userData?.handle === teamData.owner && (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="text-primary cursor-pointer px-2 text-xs md:text-lg"
                        onClick={() => onRemoveMember(member)}
                      />
                    )}
                  </div>
                ))}
              </div> */}
              <div className="mt-10 mb-10 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="text-primary"
                    size="xl"
                  />
                  <input
                    type="text"
                    placeholder="Add Title"
                    className="border rounded p-1 text-primary"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="text-primary"
                    size="xl"
                  />
                  <DatePicker
                    placeholderText="Start Date"
                    className="border rounded p-1"
                    selected={newEvent.start}
                    onChange={(start) => setNewEvent({ ...newEvent, start })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="text-primary"
                    size="xl"
                  />
                  <DatePicker
                    placeholderText="End Date"
                    className="border rounded p-1"
                    selected={newEvent.end}
                    onChange={(end) => setNewEvent({ ...newEvent, end })}
                  />
                </div>
                <button
                  className="mt-2 border rounded-lg p-2 text-secondary bg-blue-500 hover:bg-blue-600 active:scale-110"
                  onClick={handleCreateEvent}
                >
                  Add Event
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-accent text-primary font-bold px-4 py-2 rounded hover:bg-primary hover:text-secondary w-full"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleTeaMeeting;
