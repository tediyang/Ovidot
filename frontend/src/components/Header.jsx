import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const [ isOpen, setIsOpen ] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="flex justify-between xl:justify-center xl:gap-[23rem] items-center my-5">
      <div className="flex items-center">
        <MobileMenu isOpen={isOpen} path={path} toggleMenu={toggleMenu} />
        <img className="w-[100px] sm;w-[120px]" src={logo} alt="ovidot" />
      </div>
      {
        <nav className="hidden sm:flex">
          <ul className="flex gap-10 list-none font-semibold text-base">
            <li>
              <Link
                to="/"
                className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${
                  path === "/" && "text-[#4D0B5E]"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("about"
                ) && "text-[#4D0B5E]"}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${
                  path.includes("help") && "text-[#4D0B5E]"
                }`}
              >
                Help
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${
                  path.includes("contact") && "text-[#4D0B5E]"
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      }
      <button className="w-[85px] md:w-[90px] min-h-[30px] font-[500] text-xs text-[#4D0B5E] bg-white border border-[#4D0B5E] rounded-[8px] font-[cabin] shadow-evenly">
        Sign In
      </button>
    </header>
  );
};

export default Header;
