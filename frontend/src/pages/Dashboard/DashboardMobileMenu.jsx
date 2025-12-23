import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import PropTypes from 'prop-types';

const DashboardMobileMenu = ({ isOpen, toggleMenu, path }) => {
  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <button
        onClick={toggleMenu}
        className={
          "flex flex-col justify-center items-start w-10 h-10 bg-transparent rounded-md transition-all duration-300 ease-in-out z-30 lg:hidden border-0"
        }
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span
          className={`block w-6 h-0.5 bg-[#4D0B5E] relative rounded-full transition-all duration-300 ease-in-out before:content-[""] before:absolute before:bg-[#4D0B5E] before:w-4 before:h-0.5 before:top-[6px] before:left-0 after:content-[""] after:absolute after:bg-[#4D0B5E] after:w-6 after:h-0.5 after:bottom-[6px] after:left-0`}
        ></span>
      </button>

      {/* Overlay for when menu is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#4D0B5E] bg-opacity-20 z-20 lg:hidden"
          onClick={toggleMenu} // Close menu when clicking outside
        ></div>
      )}

      {/* Mobile Menu (Off-canvas) */}
      <nav
        className={`flex flex-col items-center gap-5 lg:hidden bg-white fixed inset-y-0 w-3/4 sm:w-2/4 h-[100dvh] z-30 transform transition-[right] duration-300 ease-in-out ${ isOpen ? "-right-0" : "-right-[30rem] sm:-right-[50rem]" }`}
      >
        <ul className="self-start flex flex-col gap-3 ml-5 p-6 space-y-4 mt-20 list-none">
          <li>
            <Link
              to="/dashboard"
              className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${
                path.includes("dashboard") && "text-[#4D0B5E]"
                }`
              }
              onClick={toggleMenu}
            >
              DASHBOARD
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("profile"
              ) && "text-[#4D0B5E]"}`}
              onClick={toggleMenu}
            >
              PROFILE
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("settings"
              ) && "text-[#4D0B5E]"}`}
              onClick={toggleMenu}
            >
              SETTINGS
            </Link>
          </li>
        </ul>
        <div className="self-start flex flex-col items-start gap-2 ml-5 p-6 mt-4">
          <p className="text-gray-600 text-sm">EMAIL</p>
          <p className="text-[#4D0B5E]/90 text-lg">info@ovidot.com</p>
        </div>
        <FaTimes
          onClick={toggleMenu}
          className="absolute top-6 right-4 text-[#4D0B5E] text-3xl"
        />
      </nav>
    </>
  );
};

DashboardMobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

export default DashboardMobileMenu;
