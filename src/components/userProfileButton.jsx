import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { logout } from "../redux/features/authSlice";
import { resetSearch } from "../redux/features/searchSlice";
import { resetCollections } from "../redux/features/collectionSlice";

const UserProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth?.user);
  const savedCount = useSelector((store) => store.collection?.items?.length || 0);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase sign out error", err);
    }
    dispatch(logout());
    dispatch(resetSearch());
    dispatch(resetCollections());
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile / User Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="User profile menu"
        className="relative flex items-center justify-center p-2 sm:p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>

        {/* Small Active Indicator Dot */}
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-zinc-950 rounded-full ${
            user ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-600"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-950/10 dark:shadow-zinc-950/50 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {user ? "Signed In" : "Account"}
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate">
              {user?.name || "Guest User"}
            </p>
            {user?.email && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>

          <div className="p-1.5 space-y-1">
            {/* Clickable Saved Collections Link - only if logged in */}
            {user && (
              <Link
                to="/collections"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400 border border-zinc-200/70 dark:border-zinc-700/60 transition-all cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="font-semibold">My Collections</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
                    {savedCount}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )}

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-purple-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  <span>Sign In with Google</span>
                </Link>

                <div className="border-t border-zinc-100 dark:border-zinc-800/80 p-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/signup");
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm transition-all cursor-pointer"
                  >
                    Join Pixora Free
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileButton;
