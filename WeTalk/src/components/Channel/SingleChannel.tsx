import { useContext, useEffect, useState, useRef } from "react";
import AppContext from "../../context/AuthContext";
import { IAppContext } from "../../common/types";
import Profile from "../Profile/Profile";
import ChannelInputField from "./ChannelInputField";
import { useNavigate, useParams } from "react-router";
import {
  onChannelUpdate,
  setAllMessagesToSeenChannel,
} from "../../services/channel.service";
import { ref, update } from "@firebase/database";
import { db } from "../../config/firebase-config";
import CurrentRoom from "../Meeting/CurrentRoom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import ChannelSettings from "./ChannelSettings";
import ChannelMessageSettings from "./ChannelMessageSettings";
import SeenIcons from "../MainSidebar/Chats/SeenIcons";
import { getUserByHandle } from "../../services/users.service";
import { getAllTeamMembers } from "../../services/teams.service";

type MessageType = {
  sender: string;
  message: string;
  timestamp: number;
};

type ChannelType = {
  channelName: string;
  members: string[];
  messages: Record<string, MessageType>;
  teamName: string;
  roomId: string;
  roomStatus: string;
};

type SingleChannelProps = {
  channelId: string;
};

const SingleChannel: React.FC<SingleChannelProps> = ({ channelId }) => {
  const { userData } = useContext(AppContext) as IAppContext;
  const [channel, setChannel] = useState<ChannelType | null>({
    channelName: "",
    members: [],
    messages: {},
    teamName: "",
    roomId: "",
    roomStatus: "",
  });
  const [isCallButtonClicked, setIsCallButtonClicked] = useState(false);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [users, setUsers] = useState<IUserData[]>([]);
  // const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllTeamMembers(channel.teamName);
        setTeamMembers(result);
        //console.log(teamMembers)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length]);
  //console.log(teamName)

  useEffect(() => {
    const handleUserByHandle = async () => {
      try {
        const userData = [];

        for (const member of teamMembers) {
          const snapshot = await getUserByHandle(member);

          if (snapshot.exists()) {
            const userDataForMember = snapshot.val();
            if (userDataForMember) {
              userData.push({
                firstName: userDataForMember.firstName,
                lastName: userDataForMember.lastName,
                handle: userDataForMember.handle,
              });
            }
          }
        }
        setUsers(userData);
        //console.log(users);
        return userData;
      } catch (error) {
        console.error(error);
      }
    };
    handleUserByHandle();
  }, [teamMembers]);

  //  console.log(users);

  const filteredMembers = channel?.members
    .filter((member) => member !== userData?.handle)
    .map((member) => member.handle);

  const channelContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Update typing status in Firebase
    update(ref(db, `channels/${channelId}/typingStatus`), {
      [userData?.handle!]: value !== "", // Set to true if input is not empty
    });
  };

  const renderTypingIndicator = () => {
    if (typingStatus && typeof typingStatus === "object") {
      const typingMembers = Object.keys(typingStatus).filter(
        (member) => typingStatus[member] && member !== userData?.handle
      );

      if (typingMembers.length > 0) {
        const indicatorText =
          typingMembers.length === 1
            ? `${typingMembers[0]} is typing...`
            : `${typingMembers.join(", ")} are typing...`;

        return (
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-gray-500 rounded-full mr-1"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full mr-1"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full mr-1"></div>
            </div>
            <p className="ml-1">{indicatorText}</p>
          </div>
        );
      }
    }

    return null;
  };

  useEffect(() => {
    const unsubscribe = onChannelUpdate(
      channelId,
      (channelData: ChannelType) => {
        setChannel(channelData);
      },
      (messagesData: Record<string, MessageType>) => {
        console.log("Messages updated:", messagesData);
        setChannel((prevChannel) => ({
          ...prevChannel!,
          messages: messagesData,
        }));
      },
      (typingStatus: Record<string, boolean>) => {
        console.log("Typing status updated:", typingStatus);
        setTypingStatus(typingStatus);
      }
    );
    console.log(onChannelUpdate);

    return () => {
      unsubscribe();
    };
  }, [channelId]);

  useEffect(() => {
    if (channelContainerRef.current) {
      channelContainerRef.current.scrollTop =
        channelContainerRef.current.scrollHeight;
    }
    console.log(channelContainerRef.current);
  }, [channel?.messages]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    console.log("Scrollbar");

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCallButtonClick = () => {
    if (channel?.roomId) {
      console.log("Room opened");
      setIsCallButtonClicked(true);
      navigate(`/home/channels/${channelId}/${channel?.roomId}`);
    }
  };

  if (isCallButtonClicked) {
    return <CurrentRoom setIsCallButtonClicked={setIsCallButtonClicked} />;
  }

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      console.log("Component mounted. Calling handleChangeMessageStatus.");
      handleChangeMessageStatus();
    }
  }, [channel]);

  const handleChangeMessageStatus = async () => {
    try {
      console.log("Channel:", channel);
      if (!channel) {
        console.error("Channel is undefined");
        return;
      }

      if (channel.messages && Object.keys(channel.messages).length > 0) {
        const lastMessage =
          channel.messages[
            Object.keys(channel.messages)[
              Object.keys(channel.messages).length - 1
            ]
          ];
        console.log("Last message:", lastMessage);

        if (lastMessage && lastMessage.sender !== userData?.handle) {
          await setAllMessagesToSeenChannel(channelId, userData?.handle || "");
        }
        console.log("message has been seen");
      } else {
        console.log("No messages in the channel.");
      }
    } catch (error) {
      console.error("Error fetching or updating message:", error);
    }
  };

  //console.log(channel?.members);

  return (
    <div className="flex flex-col h-screen bg-secondary w-full">
      <div className="flex items-center justify-between py-2 shadow border-b">
        <div className="flex-grow">
          <h1 className="h-12 flex items-center justify-center text-2xl font-bold text-primary ml-14">
            #{channel?.channelName}
          </h1>
        </div>
        <div className="flex justify-between items-center gap-4">
          <Link to={channel?.roomId ? `${channel?.roomId}` : ""}>
            <button
              className="bg-blue-500 text-secondary px-4 py-2 rounded"
              onClick={handleCallButtonClick}
            >
              <FontAwesomeIcon icon={faVideo} />
            </button>
          </Link>
          <p className="text-primary mr-4 mt-1">
            <ChannelSettings
              channel={channel}
              channelId={channelId}
              teamName={channel.teamName}
            />
          </p>
        </div>
      </div>

      <div
        ref={channelContainerRef}
        className="flex-grow overflow-y-auto relative"
        style={{
          marginBottom: "2rem",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            /* Hide scrollbar for Chrome */
            .flex-grow::-webkit-scrollbar {
              width: 0 !important;
              display: none;
            }

            /* Hide scrollbar for Firefox */
            .flex-grow {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          `}
        </style>
        {/* {channel ? (
          <h1 className="text-center mt-3 text-primary r">
            This is the start of your conversation with
            <h2 className="font-bold">
              {channel?.members.length > 2
                ? channel?.channelName
                : channel?.members[0]?.handle !== userData?.handle
                ? `${channel?.members[0]?.firstName} ${channel?.members[0]?.lastName}`
                : `${channel?.members[1]?.firstName} ${channel?.members[1]?.lastName}`}
            </h2>
          </h1>
        ) : null} */}
        {channel &&
          renderMessages(
            channel.messages,
            userData?.handle!,
            channel.members,
            channel.channelId,
            filteredMembers
          )}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="fixed bottom-24 animate-pulse">
          <div className="text-sm text-center text-gray-500 italic">
            {renderTypingIndicator()}
          </div>
        </div>
        <ChannelInputField
          channelId={channelId}
          handle={userData?.handle!}
          setInputValue={setInputValue}
          handleInputChange={handleInputChange}
          members={filteredMembers}
        />
      </div>
    </div>
  );
};

const renderTime = (timestamp) => (
  <time className="text-xs opacity-50 mr-2">{timestamp}</time>
);

const renderChannelBubble = (
  message,
  userHandle,
  members,
  isToday,
  isYesterday,
  channelId,
  filteredMembers
) => (
  <div
    key={message.timestamp}
    className={`px-4 chat w-full ${
      message.sender === userHandle ? "chat-end" : "chat-start"
    }`}
  >
    <div className="flex-start">
      {message.sender === userHandle && (
        <ChannelMessageSettings
          channelId={channelId}
          messageId={message.messageId}
          message={message.message}
          type={message.type}
        />
      )}
    </div>
    <div className="chat-image">
      <Profile handle={message.sender} />
    </div>
    <div className="chat-header text-primary font-bold text-md mt-2 mb-1">
      {/* {members
        .filter((member) => member.handle === message.sender)
        .map((member) => `${member.firstName} ${member.lastName}`)} */}
        {message.sender}
    </div>
    <div
      className={`chat-bubble flex flex-col px-4 text-md ${
        message.sender === userHandle
          ? "bg-primary text-secondary"
          : "bg-primary bg-opacity-10 text-primary"
      }`}
    >
      {message?.type! === "file" ? (
        <img className="w-64 h-64" src={message.message} alt="img" />
      ) : (
        <div>{message.message}</div>
      )}
      {renderTime(
        isToday
          ? `Today at ${new Date(message.timestamp).toLocaleTimeString(
              "en-US",
              { hour: "numeric", minute: "numeric" }
            )}`
          : isYesterday
          ? `Yesterday at ${new Date(message.timestamp).toLocaleTimeString(
              "en-US",
              { hour: "numeric", minute: "numeric" }
            )}`
          : new Date(message.timestamp).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
      )}
    </div>
    <div>
      {filteredMembers.length === 2 && message.sender === userHandle ? (
        <>
          {allMembersHaveSeen(message, filteredMembers, userHandle) ? (
            <p className="text-xs font-bold">seen</p>
          ) : (
            <p className="text-xs font-bold">delivered</p>
          )}
        </>
      ) : (
        <>
          {allMembersHaveSeen(message, filteredMembers, userHandle) ? (
            <p className="text-xs font-bold">seen by all</p>
          ) : (
            <>
              {membersWhoHaveSeen(message, filteredMembers, userHandle).length >
                0 &&
              membersWhoHaveSeen(message, filteredMembers, userHandle).length <
                filteredMembers.length &&
              message.sender === userHandle ? (
                <div
                  className="dropdown dropdown-hover dropdown-left h-0.5 mt-0 pt-0 z-[1]"
                  key={filteredMembers[0]}
                >
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn-xs bg-secondary border-none shadow-none text-xs font-bold w-0.5 h-0.5 mt-0 pt-0 mr-4"
                  >
                    seen
                  </div>
                  <div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu shadow bg-secondary shadow rounded-box w-max z=[1]"
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      {filteredMembers.map((member) => (
                        <div key={member} style={{ marginRight: "1px" }}>
                          {message.seenBy &&
                            message.seenBy[member] === true && (
                              <SeenIcons handle={member} />
                            )}
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {membersWhoHaveSeen(message, filteredMembers, userHandle)
                .length === 0 && message.sender === userHandle ? (
                <p className="text-xs font-bold">delivered</p>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  </div>
);

const renderMessages = (
  messages: Record<string, MessageType>,
  userHandle: string,
  members,
  channelId,
  filteredMembers
) => {
  if (!messages || Object.keys(messages).length === 0) {
    return <div className="text-center mt-3 text-primary">No messages yet</div>;
  }

  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return Object.values(messages).map((message) => {
    const messageDate = new Date(message.timestamp);
    const isToday =
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();
    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    return renderChannelBubble(
      message,
      userHandle,
      members,
      isToday,
      isYesterday,
      channelId,
      filteredMembers
    );
  });
};

const allMembersHaveSeen = (message, members, userHandle) => {
  const filteredMembers = members.filter((member) => member !== userHandle);
  const seenBy = message.seenBy || {};

  const filteredSeenBy = Object.keys(seenBy).reduce((acc, member) => {
    if (member !== userHandle) {
      acc[member] = seenBy[member];
    }
    return acc;
  }, {});

  return filteredMembers.every((member) => filteredSeenBy[member] === true);
};

const membersWhoHaveSeen = (message, members, userHandle) => {
  const filteredMembers = members.filter((member) => member !== userHandle);
  const seenBy = message.seenBy || {};

  const filteredSeenBy = Object.keys(seenBy).reduce((acc, member) => {
    if (member !== userHandle) {
      acc[member] = seenBy[member];
    }
    return acc;
  }, {});

  const seenMembers = filteredMembers.filter(
    (member) => filteredSeenBy[member]
  );

  return seenMembers;
};

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return isMounted;
};

export default SingleChannel;
