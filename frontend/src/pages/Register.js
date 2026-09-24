import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsLock } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
        toast.success("Register Successfully!");
      } catch (err) {
        toast.error(err.data.message || err.error);
      }
    }
  };

  return (
    <div className="h-screen bg-[#160937] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end">
        <Link to="/">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Home
          </button>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <span className="bg-gradient-to-r from-[#00f2fe] to-[#ff00ff] text-transparent bg-clip-text text-3xl font-bold">
              FITLY AI
            </span>
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Start your AI-powered fitness journey today
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-900/50 rounded-2xl shadow-xl p-8 sm:p-10 backdrop-blur-lg border border-gray-800">
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-200"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00f2fe] focus:border-[#00f2fe] transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00f2fe] focus:border-[#00f2fe] transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00f2fe] focus:border-[#00f2fe] transition-all"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-200"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00f2fe] focus:border-[#00f2fe] transition-all"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg 
                        bg-gradient-to-r from-[#00f2fe] to-[#ff00ff] hover:from-[#00d4fe] hover:to-[#ff00dd] 
                        text-white font-medium transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00f2fe]"
            >
              <BsLock className="mr-2 h-5 w-5" />
              Create Account
            </button>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/pages/login"
                className="font-medium text-[#00f2fe] hover:text-[#ff00ff] transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
