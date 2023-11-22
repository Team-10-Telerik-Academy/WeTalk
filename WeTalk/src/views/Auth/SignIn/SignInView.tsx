import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import visible from '../../../assets/images/eye-svgrepo-com.svg';
import hidden from '../../../assets/images/eye-off-svgrepo-com.svg';
import { NavLink } from 'react-router-dom';

interface ISignInViewProps {
  isLoading: boolean;
  updateForm: (
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickShowPassword: () => void;
  showPassword: boolean;
  switchToRegisterView: () => void;
  onLogin: (event: React.FormEvent) => void;
  email: string;
  password: string;
}

const SignInView: React.FC<ISignInViewProps> = ({
  isLoading,
  updateForm,
  handleClickShowPassword,
  showPassword,
  switchToRegisterView,
  onLogin,
  email,
  password,
}) => {
  return (
    <>
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
          <div className="flex items-center justify-between">
            <button
              className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'Sign In'}{' '}
            </button>
            <NavLink to="/forgot-password">
              <span className="inline-block align-baseline font-bold text-sm text-primary hover:text-accent cursor-pointer">
                Forgot Password?
              </span>
            </NavLink>
          </div>
        </form>
      </div>
      <p className="mt-4 text-primary">
        Don't have an account yet?{' '}
        <span
          className="font-bold text-primary cursor-pointer"
          onClick={switchToRegisterView}
        >
          Sign Up
        </span>
      </p>
      <ToastContainer />
    </>
  );
};

export default SignInView;
