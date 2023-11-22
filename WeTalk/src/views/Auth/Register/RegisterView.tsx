// import joinImg from '../../../assets/images/undraw_world_re_768g.svg';
import visible from '../../../assets/images/eye-svgrepo-com.svg';
import hidden from '../../../assets/images/eye-off-svgrepo-com.svg';

interface IRegisterViewProps {
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
  switchToSignInView: () => void;
}

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
  switchToSignInView,
}) => {
  return (
    <>
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
              className="form bg-white shadow-xl border-solid border-2 rounded-lg px-8 pt-6 pb-8"
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
              <div className="flex items-center justify-between">
                <button
                  className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}{' '}
                </button>
                <button
                  className="bg-accent hover:bg-primary text-primary hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                  onClick={switchToSignInView}
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
