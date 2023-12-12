import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleChannel from "../../../../components/Channel/SingleChannel";



const SingleChannelView = () => {
  const { channelId } = useParams();

  // console.log(channelId);

  return (
    <div className="flex w-full">
      <div className="flex-none">{/* <NavigationSidebarView /> */}</div>

      <div className="flex-1 overflow-y">
        <SingleChannel channelId={channelId} />
      </div>
    </div>
  );
};

export default SingleChannelView;
