import AdminMobileMenu from './AdminMobileMenu';
import logo from '../assets/logo.png';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { adminApiService } from '../services/adminApi';

const AdminHeader = ({ page, username, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userToggle, setUserToggle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const initial = username ? username[0].toUpperCase() : 'A';
  const displayName = username
    ? username[0].toUpperCase() + username.slice(1)
    : 'Admin';

  const toggleMenu = () => setIsOpen(!isOpen);

  const logout = async () => {
    try {
      await adminApiService.logout();
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      navigate('/admin/sign-in');
    }
  };

  return (
    <div className="flex justify-between items-center px-5 bg-white h-16 -mt-5 fixed w-full z-10 shadow-[0_1px_8px_rgba(77,11,94,0.09)]">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex flex-nowrap items-center">
        <AdminMobileMenu isOpen={isOpen} toggleMenu={toggleMenu} path={path} />
        <img className="hidden sm:inline-block h-7" alt="logo" src={logo} />
      </div>

      {/* Centre: page title */}
      <h2 className="font-[700] text-lg text-primary">{page}</h2>

      {/* Right: avatar + dropdown */}
      <div className="relative">
        <div
          className="flex justify-center items-center w-10 h-10 bg-primary text-white rounded-full border-2 border-[#e9d5f5] cursor-pointer text-sm font-bold"
          onClick={() => setUserToggle(!userToggle)}
        >
          {initial}
        </div>

        {userToggle && (
          <nav className="w-[40%] sm:w-[12rem] absolute top-[3.2rem] right-0 bg-white shadow-lg border-solid border-0 border-t-2 border-primary rounded-md z-20">
            <div className="px-5 py-3 border-b border-[#f3e8ff]">
              <p className="text-sm font-semibold text-gray-700 truncate">{displayName}</p>
              <p className="text-xs text-gray-400">{role}</p>
            </div>
            <div
              onClick={logout}
              className="flex items-center justify-between px-5 py-3 text-sm hover:bg-primary hover:text-white ease-in-out duration-300 cursor-pointer"
            >
              <div className="p-2">Log out</div>
              <FaSignOutAlt />
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
