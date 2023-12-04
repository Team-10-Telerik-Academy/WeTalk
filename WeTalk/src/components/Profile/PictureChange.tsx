import { ChangeEvent, useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { imageDb } from '../../config/firebase-config';
import { IUserData } from '../../common/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

interface PictureChangeProps {
  userData: IUserData;
  setProfilePictureURL: (url: string | null) => void;
  profilePictureURL: string;
}

const PictureChange: React.FC<PictureChangeProps> = ({
  userData,
  setProfilePictureURL,
  profilePictureURL,
}) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureChange = () => {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setPreviewImg(null);
    setSelectedFile(null);
    setSelectedFileName(null);
  };

  const handlePictureSave = () => {
    if (selectedFile) {
      const imgRef = ref(imageDb, `Profile pictures/${userData?.handle}`);
      console.log(selectedFile);

      uploadBytes(imgRef, selectedFile)
        .then(async () => {
          const downloadURL = await getDownloadURL(imgRef);

          setProfilePictureURL(downloadURL);

          setPreviewImg(null);
          setSelectedFile(null);
          setSelectedFileName(null);
        })
        .catch((error) => console.error('Upload error:', error));
    }
  };

  return (
    <div className="flex justify-center gap-4 items-center my-2">
      {profilePictureURL ? (
        <img
          src={profilePictureURL}
          className="rounded-full w-36 h-36 object-cover"
        />
      ) : (
        <div className="rounded-full border-dashed border-2 border-primary w-36 h-36 object-cover flex items-center justify-center font-bold italic text-primary">
          Upload image...
        </div>
      )}
      <div className="flex justify-center items-center">
        {previewImg && (
          <img
            src={previewImg}
            alt="Preview"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'cover',
              marginRight: '8px',
              display: 'none',
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {!previewImg ? (
          <button
            className="inline-flex gap-2 items-center text-sm text-secondary bg-primary p-2 rounded font-bold hover:underline border-2 border-primary"
            onClick={handlePictureChange}
          >
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            <span className="tracking-tight text-xs lg:text-xs">
              Change avatar
            </span>
          </button>
        ) : (
          <div className="flex justify-between items-center">
            <span className="pr-4 text-xs">{selectedFileName}</span>
            <div className="flex flex-col">
              <button
                className="text-xs mb-1 gap-2 items-center text-sm text-secondary bg-primary p-2 rounded font-bold hover:underline border-2 border-primary"
                onClick={handlePictureSave}
              >
                Save
              </button>
              <button
                className="text-xs gap-2 items-center text-sm text-secondary bg-primary p-2 rounded font-bold hover:underline border-2 border-primary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PictureChange;
