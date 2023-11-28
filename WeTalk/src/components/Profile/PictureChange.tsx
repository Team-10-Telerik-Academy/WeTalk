import { ChangeEvent, useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { imageDb } from '../../config/firebase-config';
import { IUserData } from '../../common/types';

interface PictureChangeProps {
  userData: IUserData;
  setProfilePictureURL: (url: string | null) => void;
}

const PictureChange: React.FC<PictureChangeProps> = ({
  userData,
  setProfilePictureURL,
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
    <div className="flex justify-between m-2">
      <span>Profile picture</span>
      <div className="flex justify-between">
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
          <button className="text-sm" onClick={handlePictureChange}>
            Change
          </button>
        ) : (
          <div className="flex justify-between">
            <span className="pr-4">{selectedFileName}</span>
            <div className="flex flex-col">
              <button className="text-sm mb-1" onClick={handlePictureSave}>
                Save
              </button>
              <button className="text-sm" onClick={handleCancel}>
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
