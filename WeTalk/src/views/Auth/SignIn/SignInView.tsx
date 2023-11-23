import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import visible from '../../../assets/images/eye-svgrepo-com.svg';
import hidden from '../../../assets/images/eye-off-svgrepo-com.svg';
import { Link } from 'react-router-dom';

type ISignInViewProps = {
  isLoading: boolean;
  updateForm: (
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickShowPassword: () => void;
  showPassword: boolean;
  onLogin: (event: React.FormEvent) => void;
  email: string;
  password: string;
};

const SignInView: React.FC<ISignInViewProps> = ({
  isLoading,
  updateForm,
  handleClickShowPassword,
  showPassword,
  onLogin,
  email,
  password,
}) => {
  return (
    <>
      <div className="mb-4 w-2/3 flex flex-col items-center">
        <h1 className="font-bold text-primary text-2xl text-center tracking-tight">
          Sign in your account
        </h1>
        <hr className="w-20 border-t-4 border-accent mb-4 mt-4" />
      </div>
      <div className="signin-wrapper w-full max-w-xl">
        <form
          className="form bg-white shadow-xl border-solid border-2 rounded-lg p-10 w-96"
          onSubmit={onLogin}
        >
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email<span className="text-red-500"> ✱</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={updateForm('email')}
              required
            />
          </div>
          <div className="mb-16 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password<span className="text-red-500"> ✱</span>
            </label>
            <div className="flex items-center">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="******************"
                value={password}
                onChange={updateForm('password')}
                required
              />
              <button
                type="button"
                onClick={handleClickShowPassword}
                className="ml-2 absolute right-3 top-8"
              >
                {showPassword ? (
                  <img src={hidden} className="w-7 h-7" alt="Hide Password" />
                ) : (
                  <img src={visible} className="w-7 h-7" alt="Show Password" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}{' '}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <Link to="/forgot-password">
          <span className="font-bold text-primary cursor-pointer hover:underline">
            Forgot Password?
          </span>
        </Link>
        <p className="text-primary mt-2">
          Don't have an account yet?{' '}
          <Link to="/signup">
            <span className="font-bold text-primary cursor-pointer hover:underline">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignInView;
