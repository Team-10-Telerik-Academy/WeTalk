const Profile: React.FC<{ url: string }> = ({ url }) => {
  const imgUrl: string = url;

  return (
    <div className="w-10 h-10 rounded-full">
      <img src={imgUrl} alt="picture" className="rounded-full" />
    </div>
  );
};

export default Profile;
