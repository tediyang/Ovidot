import { useLocation, Link } from "react-router-dom";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

const AsideMenu = ({ user }) => {
  const location = useLocation();
  const path = location.pathname;

  const navItem = (to, label, Icon, active) => (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold no-underline transition-colors duration-150 ${
          active
            ? "bg-primary text-white"
            : "text-gray-400 hover:bg-[#FDF4FF] hover:text-primary"
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    </li>
  );

  const initials = user
    ? user.name.fname[0].toUpperCase() + user.name.lname[0].toUpperCase()
    : "—";
  const fullName = user
    ? user.name.fname[0].toUpperCase() + user.name.fname.slice(1) + " " + user.name.lname[0].toUpperCase() + user.name.lname.slice(1)
    : "";

  return (
    <nav className="hidden fixed left-0 top-16 lg:flex flex-col bg-white h-[calc(100dvh-4rem)] w-[15rem] border-r border-[#f3e8ff]">
      <ul className="flex flex-col gap-1 list-none mt-6 px-3">
        {navItem("/dashboard", "Dashboard", FaHome, path.includes("dashboard"))}
        {navItem("/profile", "Profile", FaUser, path.includes("profile"))}
        {navItem("/settings", "Settings", FaCog, path.includes("settings"))}
      </ul>
      {user && (
        <div className="mt-auto px-3 pb-5 border-t border-[#f3e8ff] pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-700 truncate">{fullName}</p>
              <p className="text-xs text-gray-400">User</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AsideMenu;
