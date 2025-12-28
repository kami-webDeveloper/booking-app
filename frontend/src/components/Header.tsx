import { Loader, LogOut, Palmtree, User } from "lucide-react";
import { Link } from "react-router";
import { useAppContext } from "../context/AppContext";
import useLogoutUser from "../features/auth/logoutUser.mutation";

const Header = () => {
  const { isLoggedIn, isLoadingValidation } = useAppContext();
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutUser();

  return (
    <header className="bg-blue-800">
      <div
        className="
          container mx-auto
          px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28
          py-4 sm:py-6
          flex flex-col sm:flex-row
          items-center sm:items-center
          gap-y-4 sm:gap-y-0
          justify-between
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-x-1 text-white font-bold tracking-tight whitespace-nowrap"
        >
          <Palmtree className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-300" />
          <span className="text-xl sm:text-2xl md:text-3xl">Holidays.com</span>
        </Link>

        {/* Right section */}
        {isLoadingValidation ? (
          <button
            disabled
            className="
              flex items-center gap-x-2
              px-4 py-2
              font-bold text-white
              bg-gray-400 rounded-md
              cursor-not-allowed opacity-70
            "
          >
            <Loader className="h-5 w-5 animate-spin" />
            Loading...
          </button>
        ) : (
          <div
            className="
              flex flex-wrap
              justify-center sm:justify-end
              items-center
              gap-2
            "
          >
            {!isLoggedIn ? (
              <>
                <Link
                  to="/register"
                  className="
                    flex items-center gap-x-1
                    px-3 py-2 sm:px-4
                    text-sm sm:text-base
                    font-bold text-blue-600
                    bg-white rounded-md
                    hover:bg-gray-100
                    transition
                    whitespace-nowrap
                  "
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Sign Up
                </Link>

                <Link
                  to="/sign-in"
                  className="
                    flex items-center gap-x-1
                    px-3 py-2 sm:px-4
                    text-sm sm:text-base
                    font-bold text-white
                    border border-gray-100
                    rounded-md
                    hover:bg-gray-100 hover:text-blue-600
                    transition
                    whitespace-nowrap
                  "
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/my-bookings"
                  className="
                    px-3 py-2
                    text-sm sm:text-base
                    font-bold text-white
                    rounded-md
                    hover:bg-blue-600
                    transition
                    whitespace-nowrap
                  "
                >
                  My Bookings
                </Link>

                <Link
                  to="/my-hotels"
                  className="
                    px-3 py-2
                    text-sm sm:text-base
                    font-bold text-white
                    rounded-md
                    hover:bg-blue-600
                    transition
                    whitespace-nowrap
                  "
                >
                  My Hotels
                </Link>

                <button
                  disabled={isLoggingOut}
                  onClick={() => logoutUser()}
                  className="
                    flex items-center gap-x-1
                    px-3 py-2 sm:px-4
                    text-sm sm:text-base
                    font-bold text-white
                    bg-red-600 rounded-md
                    hover:bg-red-500
                    transition
                    whitespace-nowrap
                    disabled:opacity-70
                  cursor-pointer"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
