import React, { useState } from "react";
import { filteredUsers } from "../../services/users.service";
import Profile from "../Profile/Profile";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  handle: string;
  email: string;
  imageUrl: string;
}

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<UserData[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    try {
      const filteredUsersData = await filteredUsers(searchTerm);
      console.log(filteredUsersData);
      setFilteredData(filteredUsersData);
      //onSearch(searchTerm);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredData([]);
  };

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn text-primary w-full"
        onClick={() =>
          (
            document.getElementById("my_modal_5") as HTMLDialogElement
          )?.showModal()
        }
      >
        Search...
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle text-primary">
        <div className="modal-box ">
          <div>
            <div className="form-control flex flex-row pb-3 text-primary">
              <input
                type="text"
                className="w-full py-1.5 pl-10 text-secondary pr-4  bg-primary border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="Search"
                //className="input input-secondary border-primary border-2 w-full bg-white text-black"
                value={searchTerm}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <table className="w-full py-1.5 pl-10 text-secondary pr-4">
            <thead className="text-xs text-secondary uppercase "></thead>
            <tbody className="shadow shadow-2xl items-center justify-between">
              {filteredData.map((user) => (
                <tr key={user.id} className={"text-secondary"}>
                  <tr className="pb-3 sm:pb-4 text-secondary">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse mb-2 text-secondary" >
                      <div className="flex items-center justify-center">
                        <Profile handle={user.handle} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary ">
                          {`${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-sm text-secondary ">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </tr>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn text-secondary" onClick={() => handleReset()}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SearchUsers;
