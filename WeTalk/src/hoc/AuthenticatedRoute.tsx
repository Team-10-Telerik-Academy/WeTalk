import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { IChildrenProps } from '../common/types';
import AppContext from '../context/AuthContext';

export const AuthenticatedRoute: React.FC<IChildrenProps> = ({ children }) => {
  const context = useContext(AppContext);
  //   const location = useLocation();

  if (context?.user === null) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthenticatedRoute;
