import slide1 from "../../assets/images/slide-1.png";
import slide2 from "../../assets/images/slide-2.png";
import slide3 from "../../assets/images/slide-3.png";
import slide4 from "../../assets/images/slide-4.png";

const MainContentView = () => {
  const isHomePage = location.pathname === "/home";

  const carouselWidth = isHomePage
    ? "w-full"
    : "w-full lg:w-[700px] xl:w-[1100px] 2xl:w-[1507px]";

  return (
    <div className="hidden xl:block">
      <div className={`carousel ${carouselWidth} h-full z-[0]`}>
        <div id="slide1" className="carousel-item relative w-full">
          <img src={slide1} className="w-full" />
          {/*<div className="relative w-full h-full">
        <img
          src="https://media.istockphoto.com/id/1217093906/photo/womens-hand-typing-on-mobile-smartphone-live-chat-chatting-on-application-communication.jpg?s=2048x2048&w=is&k=20&c=5ruD84xHuW8x0d8W1uJK63UEbe4f-gGhgcY0RXp5Y-c="
          alt="Chat Anywhere, Anytime with WeTalk"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="text-white text-5xl font-bold flex items-center justify-center">
            Chat Anywhere, Anytime
          </div>
        </div>
      </div>*/}
          <div className="absolute flex justify-between transform -translate-y-1/2 left-10 right-10 top-1/2">
            <a
              href="#slide4"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❮
            </a>
            <a
              href="#slide2"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img src={slide2} className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-10 right-10 top-1/2">
            <a
              href="#slide1"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❮
            </a>
            <a
              href="#slide3"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img src={slide3} />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-10 right-10 top-1/2">
            <a
              href="#slide2"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❮
            </a>
            <a
              href="#slide4"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img src={slide4} className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-10 right-10 top-1/2">
            <a
              href="#slide3"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❮
            </a>
            <a
              href="#slide1"
              className="btn btn-circle text-secondary hover:bg-secondary hover:text-primary"
            >
              ❯
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContentView;
