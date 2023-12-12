import { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AddChannel from "../../../../components/Channels/AddChannel";
import AppContext from "../../../../context/AuthContext";
import { IAppContext } from "../../../../common/types";
import {
  getAllChannels,
  getLastMessage,
  updateMessageStatusToSeen,
} from "../../../../services/channels.service";

type IChannelData = {
  channelId: string;
  channelName: string;
  createdOn: number;
  members: string[];
};

type IMessageType = {
  messageId: string;
  sender: string;
  message: string;
  timestamp: number;
  edited: boolean;
  status: string;
};

const ChannelsView = () => {
  const [channels, setChannels] = useState<IChannelData[]>([]);
  const { userData } = useContext(AppContext) as IAppContext;
  const [lastMessages, setLastMessages] = useState<
    Record<string, IMessageType | null>
  >({});
  const [lastMessageForChannel, setLastMessageForChannel] = useState<
    Record<string, IMessageType | null>
  >({});

  useEffect(() => {
    const unsubscribe = getAllChannels((channelsArray) => {
      setChannels(channelsArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // const userChannels = channels.filter((channel) =>
  //   channel.members.includes(userData?.handle || "")
  // );

  useEffect(() => {
    const initialLastMessages: Record<string, IMessageType | null> = {};
    channels.forEach((channel) => {
      getLastMessage(channel.channelId, (lastMessage) => {
        initialLastMessages[channel.channelId] = lastMessage;
        setLastMessages(initialLastMessages);
      });
    });
  }, [channels]);

  // // Sort userChannels by the timestamp of the last message in descending order
  // const sortedUserChannels = userChannels.sort((a, b) => {
  //   const timestampA = lastMessages[a.channelId]?.timestamp || 0;
  //   const timestampB = lastMessages[b.channelId]?.timestamp || 0;
  //   return timestampB - timestampA;
  // });

  const handleChangeMessageStatus = async (channelId: string) => {
    try {
      const lastMessage = lastMessages[channelId];
      // Check if the lastMessage exists and the status is 'delivered'
      if (
        lastMessage?.sender !== userData?.handle &&
        lastMessage &&
        lastMessage.status === "delivered"
      ) {
        const messageId = lastMessage.messageId;

        // Update the status to 'seen'
        updateMessageStatusToSeen(channelId, messageId);
        console.log(
          `Message status updated to 'seen' for message ${messageId}`
        );
      }
    } catch (error) {
      console.error("Error fetching or updating message:", error);
    }
  };

  return (
    <div className="flex px-4 border-r bg-secondary">
      <nav className="mt-6 -mx-3 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 font-bold">
            <label className="text-primary text-2xl">Channels</label>
            {/* <AddChannel
              teamName={userData}
              isModalOpen={true}
              setIsModalOpen={[]}
            /> */}
          </div>
        </div>
        <hr className="mt-4" />

        <div
          className="flex-grow overflow-y-auto h-[calc(100vh-160px)]"
          style={{
            marginBottom: "2rem",
          }}
        >
          {sortedUserChannels.map((channel) => (
            <div key={channel.channelId}>
              <Link
                to={`${channel.channelId}`}
                className="text-gray-500 tracking-wide"
                onClick={() => handleChangeMessageStatus(channel.channelId)}
              >
                <div
                  className={`flex pt-2 flex-row my-2 pb-3 w-max rounded-xl shadow-inner hover:shadow-2xl hover:bg-primary/10 ${
                    lastMessages[channel.channelId]?.status === "delivered" &&
                    lastMessages[channel.channelId]?.sender !==
                      userData?.handle &&
                    "bg-primary/40 hover:bg-primary/30"
                  }`}
                >
                  {/* <div className="flex flex-row">
                    {channel?.members.length > 2 ? (
                      <GroupAvatar />
                    ) : (
                      <div>
                        {channel.members
                          .filter((member) => member !== userData?.handle)
                          .map((member) => (
                            <Profile key={member} handle={member} />
                          ))}
                      </div>
                    )}
                  </div> */}

                  <div className="flex flex-col pl-2">
                    {" "}
                    <div className="text-primary flex overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {channel?.channelName}
                      {/* <time className="text-xs opacity-50 text-xl p-2 ml-auto">
                        {lastMessages[channel.channelName] &&
                          new Date(
                            lastMessages[channel.channelName]?.timestamp
                          ).toLocaleTimeString()}
                      </time> */}
                      {/* <ChatSettings
                        channelName={channel.channelName}
                        channel={channel}
                      /> */}
                    </div>
                    <div className="flex items-center text-primary w-64">
                      {lastMessages[channel.channelId] && (
                        <>
                          <p className="pr-2">
                            {lastMessages[channel.channelId]?.sender}:
                          </p>
                          <p className="truncate">
                            {lastMessages[channel.channelId]?.message}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ChannelsView;
