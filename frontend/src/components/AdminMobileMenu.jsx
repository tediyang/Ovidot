import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const AdminMobileMenu = ({ isOpen, toggleMenu, path }) => {
  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="flex flex-col justify-center items-start w-10 h-10 bg-transparent rounded-md transition-all duration-300 ease-in-out z-30 lg:hidden border-0"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="admin-mobile-menu"
      >
        <span
          className={`block w-6 h-0.5 bg-primary relative rounded-full transition-all duration-300 ease-in-out before:content-[""] before:absolute before:bg-primary before:w-4 before:h-0.5 before:top-[6px] before:left-0 after:content-[""] after:absolute after:bg-primary after:w-6 after:h-0.5 after:bottom-[6px] after:left-0`}
        />
      </button>

      {/* Dimmed backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary bg-opacity-20 z-20 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Off-canvas panel — slides in from the right */}
      <nav
        id="admin-mobile-menu"
        className={`flex flex-col items-center gap-5 lg:hidden bg-white fixed inset-y-0 w-3/4 sm:w-2/4 h-[100dvh] z-30 transform transition-[right] duration-300 ease-in-out ${
          isOpen ? 'right-0' : '-right-[30rem] sm:-right-[50rem]'
        }`}
      >
        <ul className="self-start flex flex-col gap-3 ml-5 p-6 space-y-4 mt-20 list-none">
          <li>
            <Link
              to="/admin/dashboard"
              className={`text-[#3F404AB2] no-underline hover:text-primary ${
                path.includes('/admin/dashboard') && 'text-primary'
              }`}
              onClick={toggleMenu}
            >
              DASHBOARD
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`text-[#3F404AB2] no-underline hover:text-primary ${
                path.includes('/admin/users') && 'text-primary'
              }`}
              onClick={toggleMenu}
            >
              USERS
            </Link>
          </li>
          <li>
            <Link
              to="/admin/cycles"
              className={`text-[#3F404AB2] no-underline hover:text-primary ${
                path.includes('/admin/cycles') && 'text-primary'
              }`}
              onClick={toggleMenu}
            >
              CYCLES
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className={`text-[#3F404AB2] no-underline hover:text-primary ${
                path.includes('/admin/settings') && 'text-primary'
              }`}
              onClick={toggleMenu}
            >
              SETTINGS
            </Link>
          </li>
        </ul>
        <div className="self-start flex flex-col items-start gap-2 ml-5 p-6 mt-4">
          <p className="text-gray-600 text-sm">ADMIN PORTAL</p>
          <p className="text-primary/90 text-lg">Ovidot Admin</p>
        </div>
        <FaTimes
          onClick={toggleMenu}
          className="absolute top-6 right-4 text-primary text-3xl cursor-pointer"
        />
      </nav>
    </>
  );
};

AdminMobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

export default AdminMobileMenu;
