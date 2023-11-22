import { createContext } from 'react';
import { IAppContext } from '../common/types';

const AppContext = createContext<IAppContext | undefined>({
  user: null,
  userData: null,
  setContext: () => {},
});

export default AppContext;
