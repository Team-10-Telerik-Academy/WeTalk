import React, { useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { SendMessage, sendFile } from "../../services/chat.service";
import { imageDb } from "../../config/firebase-config";
import { v4 } from "uuid";

const SendFile = ({
  chatId,
  onSave,
}: {
  chatId: string;
  onSave: (file: File) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      const storageReference = ref(
        imageDb,
        `chats/${chatId}/files/${selectedFile.name}_${v4()}`
      );

      try {
        await uploadBytes(storageReference, selectedFile);

        onSave(selectedFile);
        const fileInput = document.getElementById(
          "fileInput"
        ) as HTMLInputElement;
        fileInput.value = "";
        setSelectedFile(null);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  };

  return (
    <div className="text-3xl text-primary pr-3">
      <label htmlFor="fileInput" className="cursor-pointer">
        <CiFileOn />
      </label>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div className="flex">
          {/* <img
            src={URL.createObjectURL(selectedFile)}
            alt="File Preview"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          /> */}
          <button onClick={handleSave} className="text-sm underline mr-2">
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default SendFile;
