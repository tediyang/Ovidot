import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  console.log(path)

  return (
    <header className="flex justify-between items-center my-5">
      <img className="w-[85px] md:w-[90px]" src={logo} alt="ovidot"/>
      {
        <nav className="hidden sm:flex">
          <ul className="flex gap-10 list-none font-semibold text-base">
            <li><Link to="/" className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path === "/" && "text-[#4D0B5E]"}`}>Home</Link></li>
            <li><Link to="/about" className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("about")}`}>About</Link></li>
            <li><Link to="/help" className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("help") && "text-[#4D0B5E]"}`}>Help</Link></li>
            <li><Link to="/contact" className={`text-[#3F404AB2] no-underline hover:text-[#4D0B5E] ${path.includes("contact") && "text-[#4D0B5E]"}`}>Contact</Link></li>
          </ul>
        </nav>
      }
      <button className="w-[85px] md:w-[90px] min-h-[30px] font-[500] text-xs text-[#4D0B5E] bg-white border border-[#4D0B5E] rounded-[8px] font-[cabin] shadow-evenly">Sign In</button>
    </header>
  )
}

export default Header;
