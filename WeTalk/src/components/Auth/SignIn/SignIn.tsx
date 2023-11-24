import { useContext, useState } from 'react';
import AppContext from '../../../context/AuthContext';
import { loginUser } from '../../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../config/firebase-config';
import { MIN_PASSWORD_LENGTH } from '../../../common/constants';
import { IAppContext, IAppState } from '../../../common/types';
import SignInView from '../../../views/Auth/SignIn/SignInView';
import { ToastContainer, toast } from 'react-toastify';

const SignIn = () => {
  const [user] = useAuthState(auth);
  const [appState, setAppState] = useState<IAppState>({
    user: null,
    userData: null,
  });

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setContext, userData } = useContext(AppContext) as IAppContext;
  const navigate = useNavigate();

  if (appState.user !== user) {
    setAppState({ user, userData });
  }

  const updateForm =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        [field]: e.target.value,
      });
    };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email) {
      toast.warning('Email is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }
    if (!form.password) {
      toast.warning('Password is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      toast.warning('Password must be at least 6 characters long!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      loginUser(form.email, form.password)
        .then((credential) => {
          setContext({
            user: credential.user,
            userData,
          });
        })
        .then(() => {
          navigate('/home');
          toast.success(`Welcome to the forum!`, {
            autoClose: 3000,
            className: 'font-bold',
          });
        })
        .catch(() => {
          toast.error('Invalid email or password. Please try again.', {
            autoClose: 3000,
            className: 'font-bold',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center">
          <SignInView
            isLoading={isLoading}
            updateForm={updateForm}
            handleClickShowPassword={handleClickShowPassword}
            showPassword={showPassword}
            onLogin={onLogin}
            email={form.email}
            password={form.password}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignIn;
