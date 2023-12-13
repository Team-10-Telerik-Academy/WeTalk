import { getDownloadURL, listAll, ref } from "@firebase/storage";
import { useEffect, useState } from "react";
import { imageDb } from "../../../config/firebase-config";
import { onValue } from "@firebase/database";

const Media = ({ chatId }) => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const storageRef = ref(imageDb, `chats/${chatId}/files`);

    const fetchMedia = async () => {
      try {
        const listResult = await listAll(storageRef);
        const mediaURLs = await Promise.all(
          listResult.items.map(async (item) => {
            const downloadURL = await getDownloadURL(item);
            return downloadURL;
          })
        );
        setMedia(mediaURLs || []);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();
  }, [chatId]);

  return (
    <div className="flex flex-wrap -m-1 overflow-y-auto">
      {media.length !== 0 ? (
        media.map((mediaURL, index) => (
          <div key={index} className="media-item p-1 w-1/2 h-32">
            <img
              src={mediaURL}
              alt={`Media ${index}`}
              className="w-full h-full object-contain border"
            />
          </div>
        ))
      ) : (
        <div className="mt-10 text-center w-full">
          <p className="font-bold text-sm text-black">no files yet</p>
        </div>
      )}
    </div>
  );
};

export default Media;
