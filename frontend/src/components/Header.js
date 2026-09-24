import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import MenuIcon  from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../assets/images/Logo.png";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      window.location.href = "/";
      toast.success("Logout Successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLinkClick = (url) => {
    setActiveLink(url);
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors ${
          isActive ? "font-semibold text-blue-600" : ""
        }`}
        onClick={() => handleLinkClick(to)}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="logo" className="w-24" />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className="text-gray-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-grow ml-6">
            <div className="flex items-center space-x-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/features">Features</NavLink>
              <NavLink to="/contact">Contact Us</NavLink>
              <NavLink to="/pages/about">About</NavLink>
              <NavLink to="/pages/Profile">View Profile</NavLink>
            </div>

            <div className="flex items-center">
              {userInfo ? (
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/pages/register"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/pages/login"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/features">Features</NavLink>
              <NavLink to="/contact">Contact Us</NavLink>
              <NavLink to="/pages/about">About</NavLink>
              <NavLink to="/pages/bmr-calculator">View Profile</NavLink>

              {userInfo ? (
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium mt-2 w-full text-left"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col space-y-2 mt-2">
                  <Link
                    to="/pages/register"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/pages/login"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
