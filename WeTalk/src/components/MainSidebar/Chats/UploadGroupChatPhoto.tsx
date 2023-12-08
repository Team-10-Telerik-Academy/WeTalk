import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { imageDb } from "../../../config/firebase-config";

const UploadGroupChatPhoto = ({ chat, setGroupAvatarUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(
    chat?.imgUrl || null
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set initial previewImg value to existing group avatar URL
    setPreviewImg(chat?.imgUrl || null);
  }, [chat]);

  const handlePictureChange = () => {
    setEditMode(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreviewImg(URL.createObjectURL(file));
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPreviewImg(chat?.imgUrl || null);
    setSelectedFile(null);
    setSelectedFileName(null);
  };

  const handlePictureSave = () => {
    if (selectedFile) {
      const imgRef = ref(imageDb, `Group Chat Avatars/${chat.chatName}`);

      uploadBytes(imgRef, selectedFile)
        .then(async () => {
          const downloadURL = await getDownloadURL(imgRef);

          setGroupAvatarUrl(downloadURL);

          setEditMode(false);
          setPreviewImg(null);
          setSelectedFile(null);
          setSelectedFileName(null);
        })
        .catch((error) => console.error("Upload error:", error));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold">Group avatar</span>
      <div className="flex flex-col items-center justify-between">
        {(editMode || previewImg) && (
          <img
            src={editMode ? previewImg : chat?.imgUrl}
            alt="Preview"
            className="rounded-full border"
            style={{
              width: "250px",
              height: "250px",
              objectFit: "cover",
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {editMode ? (
          <div className="flex flex-col text-center mt-5">
            <span className="pr-4">{selectedFileName}</span>
            <div className="flex flex-col">
              <button className="text-sm mb-1 btn" onClick={handlePictureSave}>
                Save
              </button>
              <button className="text-sm btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="text-sm mt-5 btn" onClick={handlePictureChange}>
            Change
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadGroupChatPhoto;
