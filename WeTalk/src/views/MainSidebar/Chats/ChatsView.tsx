const ChatsView = () => {
  return (
    <>
      <nav className="mt-6 -mx-3 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 font-bold ">
            <label className="text-primary text-2xl dark:text-gray-400">
              Chats
            </label>
            <button className="text-primary text-lg text-center w-8 shadow-md rounded-lg border-primary border-2 px-1 hover:bg-primary hover:text-secondary">
              +
            </button>
          </div>
        </div>
        <hr className="mt-4" />
        <div>
          <p className="px-3 text-gray-500 tracking-wide">#Chat1</p>
          <p className="px-3 text-gray-500 tracking-wide">#Chat2</p>
          <p className="px-3 text-gray-500 tracking-wide">#Chat3</p>
        </div>
      </nav>
    </>
  );
};

export default ChatsView;
