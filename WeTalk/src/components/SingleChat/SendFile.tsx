import React, { useState } from "react";
import { CiFileOn } from "react-icons/ci";

const SendFile = ({
  chatId,
  onSave,
}: {
  chatId: string;
  onSave: (file: File) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setShowModal(true);
    }
  };

  const modalId = `${chatId}1`;

  const handleSave = async () => {
    if (selectedFile) {
      try {
        onSave(selectedFile);
        const fileInput = document.getElementById(
          "fileInput"
        ) as HTMLInputElement;
        fileInput.value = "";
        setSelectedFile(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  };

  const handleCancel = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.value = "";
    setSelectedFile(null);
    setShowModal(false);
  };

  return (
    <div className="flex">
      <label
        htmlFor="fileInput"
        className="cursor-pointer text-primary text-3xl mr-2.5"
      >
        <CiFileOn />
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </label>
      {showModal && selectedFile && (
        <dialog id={`${modalId}`} className="modal" open={showModal}>
          <div className="modal-box">
            <div className="flex flex-col items-center justify-between">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="File Preview"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
                className="border rounded-lg"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleSave}
                  className="btn text-sm mr-2 text-black"
                >
                  Send
                </button>
                <button
                  onClick={handleCancel}
                  className="btn text-sm mr-2 text-black"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="modal-action"></div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default SendFile;
