import { useState, useEffect } from "react";
import { searchGifs, trendingGifs } from "../../services/giphy.service";

import { MdOutlineGifBox } from "react-icons/md";
import { sendGiphyUrl } from "../../services/channel.service";

const ChannelGiphy: React.FC<{ channelId: string; handle: string; members }> = ({
  channelId,
  handle,
  members,
}) => {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<string[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  const handleSelect = (gif: string) => {
    setSelectedGif(gif);
  };

  const filteredMembers = members.filter((member) => member !== handle);

  const handleSearch = async (searchQuery: string) => {
    try {
      const newGifs =
        searchQuery.trim() === ""
          ? await trendingGifs()
          : await searchGifs(searchQuery);
      setGifs(newGifs);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      setGifs([]);
    }
  };

  const handleSave = async () => {
    if (selectedGif) {
      try {
        await sendGiphyUrl(channelId, selectedGif, handle, filteredMembers);
        setSelectedGif(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    handleSearch("");
  }, []);

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  const handleClose = () => {
    setQuery("");
    setSelectedGif(null);
  };

  return (
    <div>
      <button
        className="btn text-4xl border-none text-primary pr-3"
        onClick={() => document.getElementById("my_modal_4").showModal()}
      >
        <MdOutlineGifBox />
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <div className="bg-secondary">
            <input
              className="text-primary placeholder-primary border rounded-lg pl-2 mb-2"
              type="text"
              value={query}
              placeholder="search"
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="flex flex-wrap -m-1 overflow-y-auto h-64">
              {gifs.map((gif, index) => (
                <img
                  className={`p-1 w-1/2 h-32 ${
                    selectedGif === gif ? "border-2 border-accent" : ""
                  }`}
                  key={index}
                  src={gif}
                  alt={`GIF ${index}`}
                  onClick={() => handleSelect(gif)}
                  onDoubleClick={() => handleSave()}
                />
              ))}
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleClose}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ChannelGiphy;
