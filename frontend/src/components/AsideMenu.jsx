import { useLocation, Link } from "react-router-dom";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

const AsideMenu = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <nav className="hidden fixed left-0 lg:flex flex-col bg-white h-[100dvh] w-[15rem]">
      <ul className="flex flex-col gap-6 list-none mt-24 text-sm">
        <li
          className={`${
            path.includes("dashboard")
              ? "bg-[#4D0B5E] bg-opacity-20 border-solid border-0 border-r-4 border-primary p-6 text-primary"
              : "text-[#3F404AB2] hover:text-[#4D0B5E] px-6 py-2"
          }`}
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-3 flex-nowrap no-underline"
          >
            <FaHome size={20} />
            DASHBOARD
          </Link>
        </li>
        <li
          className={`${
            path.includes("profile")
              ? "bg-[#4D0B5E] bg-opacity-20 border-solid border-0 border-r-4 border-primary p-6 text-primary"
              : "text-[#3F404AB2] hover:text-[#4D0B5E] px-6 py-2"
          }`}
        >
          <Link
            to="/profile"
            className="flex items-center gap-3 flex-nowrap no-underline"
          >
            <FaUser size={20} />
            PROFILE
          </Link>
        </li>
        <li
          className={`${
            path.includes("settings")
              ? "bg-[#4D0B5E] bg-opacity-20 border-solid border-0 border-r-4 border-primary p-6 text-primary"
              : "text-[#3F404AB2] hover:text-[#4D0B5E] px-6 py-2"
          }`}
        >
          <Link
            to="/settings"
            className="flex items-center gap-3 flex-nowrap no-underline"
          >
            <FaCog size={20} />
            SETTINGS
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AsideMenu;
