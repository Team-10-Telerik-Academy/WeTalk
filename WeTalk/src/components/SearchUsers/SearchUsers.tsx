import React, { useState } from "react";
import { filteredUsers } from "../../services/users.service";

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
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_5") as HTMLDialogElement
          )?.showModal()
        }
      >
        Search...
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div>
            <div className="form-control flex flex-row">
              <input
                type="text"
                className="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-secondary border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="Search"
                //className="input input-secondary border-primary border-2 w-full bg-white text-black"
                value={searchTerm}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <table>
            <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"></thead>
            <tbody className="shadow shadow-2xl items-center justify-between">
              {filteredData.map((user) => (
                <tr key={user.id} className={"bg-white"}>
                  <li className="pb-3 sm:pb-4">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        {/* <img className="w-8 h-8 rounded-full" src={user.imageSrc} alt={`Profile of ${user.firstName} ${user.lastName}`}/> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {`${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </li>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={() => handleReset()}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SearchUsers;
