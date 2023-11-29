import { useContext, useState } from 'react';
import AppContext from '../../../context/AuthContext';
import {
  getUserByHandle,
  createUserHandle,
} from '../../../services/users.service';
import { registerUser } from '../../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  VALID_EMAIL,
  VALID_PHONE_NUMBER,
} from '../../../common/constants';
import { IAppContext } from '../../../common/types';
import RegisterView from '../../../views/Auth/Register/RegisterView';
import { UserCredential } from 'firebase/auth';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    handle: '',
    phoneNumber: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { setContext } = useContext(AppContext) as IAppContext;
  const navigate = useNavigate();

  const updateForm =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        [field]: e.target.value,
      });
    };

  const onRegister = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.firstName) {
      toast.warning('First Name is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.lastName) {
      toast.warning('Last Name is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (
      form.firstName.length < MIN_USERNAME_LENGTH ||
      form.firstName.length > MAX_USERNAME_LENGTH
    ) {
      toast.warning(
        `First Name must contain between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters!`,
        {
          autoClose: 3000,
          className: 'font-bold',
        }
      );
      return;
    }

    if (
      form.lastName.length < MIN_USERNAME_LENGTH ||
      form.lastName.length > MAX_USERNAME_LENGTH
    ) {
      toast.warning(
        `Last Name must contain between ${MIN_USERNAME_LENGTH} and ${MIN_USERNAME_LENGTH} characters!`,
        {
          autoClose: 3000,
          className: 'font-bold',
        }
      );
      return;
    }

    if (form.phoneNumber && !VALID_PHONE_NUMBER.test(form.phoneNumber)) {
      toast.warning(`Please enter a valid phone number (digits only)!`, {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.email) {
      toast.warning('Email is required!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.email.match(VALID_EMAIL)) {
      toast.warning('Invalid email format!', {
        autoClose: 3000,
        className: 'font-bold',
      });
      return;
    }

    if (!form.handle) {
      toast.warning('Username is required!', {
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
      toast.warning(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long!`,
        {
          autoClose: 3000,
          className: 'font-bold',
        }
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      getUserByHandle(form.handle)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();

            if (userData.email === form.email) {
              throw new Error(`Email ${form.email} has already been taken!`);
            } else if (userData.handle === form.handle) {
              throw new Error(
                `Username ${form.handle} has already been taken!`
              );
            }
          }

          return registerUser(form.email, form.password);
        })
        .then((credential: UserCredential) => {
          navigate('/home');
          toast.success(`Welcome to the forum!`, {
            autoClose: 3000,
            className: 'font-bold',
          });

          const userEmail = credential.user.email!;

          return createUserHandle(
            form.handle,
            form.firstName,
            form.lastName,
            form.phoneNumber,
            credential.user.uid,
            userEmail
          ).then(() => {
            setContext({
              user: credential.user,
              userData: {
                firstName: form.firstName,
                lastName: form.lastName,
                handle: form.handle,
                email: form.email,
                phoneNumber: form.phoneNumber,
                imgUrl: '',
              },
            });
          });
        })
        .catch((e) => {
          if (e.message === 'Firebase: Error (auth/email-already-in-use).') {
            toast.error(`Email ${form.email} has already been taken!`, {
              autoClose: 3000,
              className: 'font-bold',
            });
          } else {
            toast.error(e.message, {
              autoClose: 3000,
              className: 'font-bold',
            });
          }
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
          <RegisterView
            onRegister={onRegister}
            updateForm={updateForm}
            firstName={form.firstName}
            lastName={form.lastName}
            email={form.email}
            handle={form.handle}
            phoneNumber={form.phoneNumber}
            showPassword={showPassword}
            password={form.password}
            handleClickShowPassword={handleClickShowPassword}
            isLoading={isLoading}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
