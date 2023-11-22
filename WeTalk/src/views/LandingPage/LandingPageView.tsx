import { useState } from 'react';
import SignIn from '../../components/Auth/SignIn/SignIn';

const LandingPageView = () => {
  const [showMoreText, setShowMoreText] = useState(false);

  const handleReadMoreClick = () => {
    setShowMoreText(!showMoreText);
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-800 i justify-around items-center hidden">
        <div className="w-1/2 mx-auto">
          <div className="mb-6">
            <h1 className="text-white font-extrabold text-4xl tracking-tight font-sans">
              WeTalk
            </h1>
            <p className="text-white mt-1 tracking-wide font-bold">
              Elevate Your Communication Experience
            </p>
          </div>
          {showMoreText ? (
            <>
              <hr className="w-10 border-t-2 border-white" />
              <p className="text-white mt-2 tracking-wide font-light">
                Welcome to WeTalk, a cutting-edge collaboration and messaging
                app designed to revolutionize real-time communication and
                collaboration for individuals and teams. WeTalk offers a
                seamless platform for users to share information, link
                resources, and engage in dynamic conversations, including voice
                and video interactions.
              </p>
            </>
          ) : (
            <button
              type="submit"
              className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
              onClick={handleReadMoreClick}
            >
              Read More
            </button>
          )}
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <SignIn />
      </div>
    </div>
  );
};
export default LandingPageView;
