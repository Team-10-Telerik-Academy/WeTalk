interface StatusProps {
  status: string;
}

const Status: React.FC<StatusProps> = ({ status }) => {
  return (
    <div className="absolute bottom-0 right-0">
      {status === 'active' && (
        <div className="rounded-full bg-success h-3 w-3"></div>
      )}
      {status === 'offline' && (
        <div className="rounded-full bg-gray-400 h-3 w-3"></div>
      )}
      {status === 'busy' && (
        <div className="rounded-full bg-error h-3 w-3"></div>
      )}
    </div>
  );
};

export default Status;
