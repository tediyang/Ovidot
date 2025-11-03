import DashboardMobileMenu from "./DashboardMobileMenu";
import logo from "../../assets/logo.png";
import { apiService } from "../../services/api";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBell, FaTimes, FaCheck, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ user, page }) => {
  const location = useLocation();
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [userToggle, setUserToggle] = useState(false);
  const [notifications, setNotifications] = useState(user?.notificationsList);
  const navigate = useNavigate();

  const notificationUnread = notifications && notifications.filter(
    (notification) => notification.status === "UNREAD"
  );
  const notificationCount = notificationUnread?.length;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotification = () => {
    if (userToggle) setUserToggle(!userToggle);
    setNotificationToggle(!notificationToggle);
  };

  const toggleUser = () => {
    if (notificationToggle) setNotificationToggle(!notificationToggle);
    setUserToggle(!userToggle);
  };

  function getTime(timestamp, options = {}) {
    const { includeSeconds = true, compact = false } = options;

    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 0) {
      return "just now"; // Future dates
    }

    // Less than 1 minute
    if (seconds < 60) {
      if (includeSeconds) {
        if (seconds < 10) return compact ? "now" : "just now";
        if (seconds < 20) return compact ? "10s" : "10 seconds ago";
        if (seconds < 40) return compact ? "30s" : "30 seconds ago";
        return compact ? "1m" : "1 minute ago";
      }
      return compact ? "1m" : "1 minute ago";
    }

    const minutes = Math.floor(seconds / 60);
    // Less than 1 hour
    if (minutes < 60) {
      if (compact) return `${minutes}m`;
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    // Less than 1 day
    if (hours < 24) {
      if (compact) return `${hours}h`;
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    // Less than 1 month (approx 30 days)
    if (days < 30) {
      if (compact) return `${days}d`;
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }

    const months = Math.floor(days / 30);
    // Less than 1 year
    if (months < 12) {
      if (compact) return `${months}mo`;
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }

    const years = Math.floor(days / 365);
    if (compact) return `${years}y`;
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }

  // API calls
  const readAllRequest = async () => {
    try {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        status: "READ",
      }));
      setNotifications(updatedNotifications);
      await apiService.getData("/auth/users/notifications/readAll");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const readRequest = async (id) => {
    try {
      const updatedNotifications = notifications.map((notification) =>
        notification._id === id
          ? { ...notification, status: "READ" }
          : notification
      );
      setNotifications(updatedNotifications);
      await apiService.getData(`/auth/users/notifications/${id}`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const deleteRequest = async (id) => {
    try {
      const updatedNotifications = notifications.filter(
        (notification) => notification._id !== id
      );
      setNotifications(updatedNotifications);
      await apiService.deleteData("/auth/users/notifications", id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await apiService.logout();
      console.log(response.status);

      if (response && response.message.includes("Successful")) {
        navigate("/sign-in")
      }

    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }

  return (
    <div className="flex justify-between items-center px-5 bg-white h-16 -mt-5 fixed w-full z-10">
      {/* Nav and header */}
      <div className="flex flex-nowrap items-center">
        <DashboardMobileMenu
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          path={path}
        />
        <img className="hidden sm:inline-block h-7" alt="logo" src={logo} />
      </div>
      {/* Page Name */}
      <h2 className="font-[700] text-lg text-primary">{page}</h2>
      {/* Notification */}
      <div className="flex items-center gap-4">
        <div
          className="relative flex justify-center items-center gap-2 bg-primary w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleNotification}
        >
          <FaBell className="w-6 h-6 text-white" />
          <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {notificationCount > 9 ? "9+" : notificationCount}
          </div>
        </div>
        <div
          className="flex justify-center items-center w-10 h-10 bg-primary text-white rounded-full"
          onClick={toggleUser}
        >
          {user?.name.fname[0].toUpperCase()}
          {user?.name.lname[0].toUpperCase()}
        </div>
      </div>
      {/* Notification Modal */}
      {notificationToggle && (
        <div className="w-[85%] sm:w-[25rem] absolute top-[4rem] right-2 bg-white shadow-lg border-solid border-0 border-t-2 border-primary rounded-md">
          <section className="relative px-5 py-3 border-solid border-0 border-b-[1px] border-primary border-opacity-35 font-bold">
            <span className="text-xs">Notifications</span>
            <FaTimes
              className="absolute top-3 right-3 cursor-pointer"
              onClick={toggleNotification}
            />
          </section>
          <section className="max-h-72 overflow-y-auto">
            {notifications ? (
              notifications.reverse().map((notification, index) => (
                <div
                  key={notification._id}
                  className={`${
                    notification.status === "UNREAD" && "bg-slate-50"
                  } flex flex-nowrap justify-between items-center gap-2 px-5 py-4 ${
                    index + 1 !== notificationCount &&
                    "border-solid border-0 border-b-[1px] border-primary border-opacity-35"
                  } text-xs`}
                >
                  <div className="flex flex-nowrap items-center gap-2 text-xs">
                    <div className="flex justify-center items-center bg-primary text-white rounded-full p-2">
                      <FaBell size={15} className="transform rotate-45" />
                    </div>
                    <div className="flex flex-col">
                      <p>{notification.message}</p>
                      <p className="text-[#3F404AB2]">
                        {getTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {notification.status === "UNREAD" && (
                      <FaCheck
                        size={13}
                        className="text-green-600 cursor-pointer hover:text-green-400"
                        onClick={() => readRequest(notification._id)}
                      />
                    )}
                    <FaTimes
                      size={13}
                      className="text-red-600 cursor-pointer hover:text-red-400"
                      onClick={() => deleteRequest(notification._id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-nowrap items-center gap-2 px-5 py-4 text-xs">
                No Notifications
              </div>
            )}
          </section>
          <section className="flex justify-center px-5 py-3 border-solid border-0 border-t-[1px] border-primary border-opacity-35 text-xs">
            <p className="cursor-pointer font-bold" onClick={readAllRequest}>
              Mark All
            </p>
          </section>
        </div>
      )}
      {/* User Profile Modal */}
      {userToggle && (
        <nav className="w-[40%] sm:w-[12rem] absolute top-[4rem] right-2 bg-white shadow-lg border-solid border-0 border-t-2 border-primary rounded-md">
          <div onClick={logout} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-primary hover:text-white ease-in-out duration-300 cursor-pointer">
            <div className="p-2">Log out</div>
            <FaSignOutAlt />
          </div>
        </nav>
      )}
    </div>
  );
};

export default DashboardHeader;
