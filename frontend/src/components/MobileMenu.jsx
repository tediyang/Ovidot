import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import PropTypes from 'prop-types';

const MobileMenu = (props) => {
  const { isOpen, toggleMenu, path, handleNav } = props;

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <button
        onClick={toggleMenu}
        className={
          "flex flex-col justify-center items-start w-10 h-10 bg-transparent rounded-md transition-all duration-300 ease-in-out z-30 sm:hidden border-0"
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
          className="fixed inset-0 bg-[#4D0B5E] bg-opacity-20 z-20 md:hidden"
          onClick={toggleMenu} // Close menu when clicking outside
        ></div>
      )}

      {/* Mobile Menu (Off-canvas) */}
      <nav
        className={`flex flex-col items-center gap-5 sm:hidden bg-white fixed inset-y-0 w-3/4 h-[100dvh] z-30 transform transition-[right] duration-300 ease-in-out ${ isOpen ? "-right-0" : "-right-[30rem]" }`}
      >
        <ul className="self-start flex flex-col gap-3 ml-5 p-6 space-y-4 mt-20 list-none">
          <li>
            <Link
              to="/"
              className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${
                path === "/" && "text-[#4D0B5E]"
                }`
              }
              onClick={toggleMenu}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("about"
              ) && "text-[#4D0B5E]"}`}
              onClick={toggleMenu}
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("help"
              ) && "text-[#4D0B5E]"}`}
              onClick={toggleMenu}
            >
              HELP
            </Link>
          </li>
        </ul>
        <div className="self-start flex flex-col items-start gap-2 ml-5 p-6 mt-4">
          <p className="text-gray-600 text-sm">EMAIL</p>
          <p className="text-[#4D0B5E]/90 text-lg">info@ovidot.com</p>
        </div>
        <button
          className="w-[70%] h-[4rem] text-base md:w-[90px] min-h-[30px] font-[500] text-[#4D0B5E] bg-white border border-[#4D0B5E] rounded-[8px] font-[cabin] shadow-evenly"
          onClick={handleNav}
        >
          SIGN IN
        </button>
        <FaTimes
          onClick={toggleMenu}
          className="absolute top-6 right-4 text-[#4D0B5E] text-3xl"
        />
      </nav>
    </>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  handleNav: PropTypes.func.isRequired
};

export default MobileMenu;
