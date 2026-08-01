import { useLocation, Link } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt, FaCog } from 'react-icons/fa';

const AdminAsideMenu = ({ username, role }) => {
  const location = useLocation();
  const path = location.pathname;

  const navItem = (to, label, Icon, active) => (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold no-underline transition-colors duration-150 ${
          active
            ? 'bg-primary text-white'
            : 'text-gray-400 hover:bg-[#FDF4FF] hover:text-primary'
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    </li>
  );

  const initial = username ? username[0].toUpperCase() : 'A';
  const displayName = username
    ? username[0].toUpperCase() + username.slice(1)
    : 'Admin';

  return (
    <nav className="hidden fixed left-0 top-16 lg:flex flex-col bg-white h-[calc(100dvh-4rem)] w-[15rem] border-r border-[#f3e8ff]">
      <ul className="flex flex-col gap-1 list-none mt-6 px-3">
        {navItem('/admin/dashboard', 'Dashboard', FaHome, path.includes('/admin/dashboard'))}
        {navItem('/admin/users', 'Users', FaUsers, path.includes('/admin/users'))}
        {navItem('/admin/cycles', 'Cycles', FaCalendarAlt, path.includes('/admin/cycles'))}
        {navItem('/admin/settings', 'Settings', FaCog, path.includes('/admin/settings'))}
      </ul>
      <div className="mt-auto px-3 pb-5 border-t border-[#f3e8ff] pt-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-700 truncate">{displayName}</p>
            <p className="text-xs text-gray-400">{role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminAsideMenu;
