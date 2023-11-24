import { useContext } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { IChildrenProps } from '../common/types';
// import AppContext from '../context/AuthContext';

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AppContext from '../context/AuthContext';

// export const AuthenticatedRoute: React.FC<IChildrenProps> = ({ children }) => {
//   const context = useContext(AppContext);
//   const location = useLocation();

//   if (context?.user === null && location.pathname === '/signin') {
//     return children;
//   } else if (context?.user !== null && location.pathname === '/signin') {
//     return <Navigate to="/" replace />;
//   } else if (context?.user === null) {
//     return <Navigate to="/signin" replace />;
//   }

//   return null;
// };

// export default AuthenticatedRoute;

const AuthenticatedRoute = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const toAuth =
    location.pathname === '/signin' || location.pathname === '/signup';

  // console.log(toAuth);
  // console.log(context?.user);

  if (!context?.user) {
    return toAuth ? (
      <Outlet />
    ) : (
      <Navigate to="/signin" replace state={location.pathname} />
    );
  } else {
    return toAuth ? (
      <Navigate to="/home" replace state={location.pathname} />
    ) : (
      <Outlet />
    );
  }
};

export default AuthenticatedRoute;
