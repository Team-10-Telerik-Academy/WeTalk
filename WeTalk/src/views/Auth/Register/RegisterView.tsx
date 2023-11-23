import visible from '../../../assets/images/eye-svgrepo-com.svg';
import hidden from '../../../assets/images/eye-off-svgrepo-com.svg';
import { Link } from 'react-router-dom';

type IRegisterViewProps = {
  onRegister: (event: React.FormEvent) => void;
  updateForm: (
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  firstName: string;
  lastName: string;
  email: string;
  handle: string;
  phoneNumber: string;
  showPassword: boolean;
  password: string;
  handleClickShowPassword: () => void;
  isLoading: boolean;
};

const RegisterView: React.FC<IRegisterViewProps> = ({
  onRegister,
  updateForm,
  firstName,
  lastName,
  email,
  handle,
  phoneNumber,
  showPassword,
  password,
  handleClickShowPassword,
  isLoading,
}) => {
  return (
    <>
      <div className="mb-4 w-2/3 flex flex-col items-center">
        <h1 className="font-bold text-primary text-2xl text-center tracking-tight">
          Sign up to connect, chat and collaborate effortlessly with WeTalk!
        </h1>
        <hr className="w-20 border-t-4 border-accent mb-4 mt-4" />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center">
          {/*<img
            src={joinImg}
            className="w-96 h-96 mb-2"
            alt="Join the React Community"
  />*/}
          {/*<h1 className="text-4xl font-bold text-primary mb-2">
            Welcome to WeTalk!
          </h1>
          <p className="mb-6 text-primary">
            Connect, chat, and collaborate effortlessly with WeTalk.
          </p>
          <hr className="w-32 border-t-4 border-yellow-500 mb-10" />*/}
          <div className="signin-wrapper w-full max-w-xl">
            <form
              className="form bg-white shadow-xl border-solid border-2 rounded-lg p-10"
              onSubmit={onRegister}
            >
              <div className="mb-6 flex">
                <div className="mr-2 w-1/2">
                  <label
                    htmlFor="firstName"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    First Name<span className="text-red-500"> ✱</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={updateForm('firstName')}
                    required
                  />
                </div>
                <div className="ml-2 w-1/2">
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Last Name<span className="text-red-500"> ✱</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={updateForm('lastName')}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Phone Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Phone Number (optional)"
                  value={phoneNumber}
                  onChange={updateForm('phoneNumber')}
                />
              </div>
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
                  placeholder="email@example.com"
                  value={email}
                  onChange={updateForm('email')}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="handle"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Username<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="handle"
                  id="handle"
                  placeholder="Username"
                  value={handle}
                  onChange={updateForm('handle')}
                  required
                />
              </div>
              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password<span className="text-red-500"> ✱</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-12"
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
                    <img
                      src={visible}
                      className="w-7 h-7"
                      alt="Show Password"
                    />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}{' '}
                </button>
              </div>
            </form>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-primary">
              Already have an account?{' '}
              <Link to="/signin">
                <span className="font-bold text-primary cursor-pointer hover:underline">
                  Sign In
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
