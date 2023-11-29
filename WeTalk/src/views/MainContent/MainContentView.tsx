import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import videoCalls from "../../assets/images/Video-Calls.png";
import chats from "../../assets/images/Chats.png";

const MainContentView = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
          variableWidth: false,
        },
      },
    ],
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative h-screen">
      <Slider {...settings}>
        <div className="w-full h-full">
          <img
            src={videoCalls}
            alt="Video Calls"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-full">
          <img src={chats} alt="Chats" className="w-full h-full object-cover" />
        </div>
      </Slider>
    </div>
  );
};

export default MainContentView;
