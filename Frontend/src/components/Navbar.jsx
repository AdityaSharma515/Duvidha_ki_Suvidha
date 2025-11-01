import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const AppNavbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-[1000] transition-all duration-300 bg-[#161b22] border-b border-[#30363d] backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link 
            to="/"
            className="flex items-center gap-2 text-xl font-semibold text-[#f0f6fc] no-underline"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
            }}
          >
            <FaExclamationTriangle className="text-2xl" style={{ color: '#58a6ff' }} />
            <span>Duvidha Ki Suvidha</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {token ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-[#30363d] text-[#c9d1d9] bg-transparent hover:bg-[#21262d] hover:text-[#f0f6fc] transition-colors hover:cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="font-medium text-[#c9d1d9] hover:text-[#f0f6fc] no-underline"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-[#238636] border border-[#238636] text-white hover:bg-[#2ea043] hover:border-[#2ea043] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md border border-[#30363d] text-[#c9d1d9]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#30363d]">
            <div className="flex flex-col gap-3">
              {token ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="font-medium px-2 py-2 text-[#c9d1d9]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'maintainer' && (
                    <Link 
                      to="/admin"
                      className="font-medium px-2 py-2 text-[#c9d1d9]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left px-2 py-2 font-medium rounded-md border border-[#30363d] text-[#c9d1d9] bg-transparent hover:bg-[#21262d]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="font-medium px-2 py-2 text-[#c9d1d9]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-2 py-2 text-sm font-medium rounded-md bg-[#238636] border border-[#238636] text-white text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
