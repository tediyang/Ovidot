import AsideMenu from "../../components/AsideMenu";
import Error401 from "../Errors/Error401";
import DashboardToast from "../Dashboard/DashboadToast";
import { apiService } from "../../services/api";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";


const SettingsBody = ({ user, setUser, error, redirect }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deactivePopup, setDeactivePopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [changePasswordPopup, setChangePasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // State for toggling visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const timeOutMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const cancelButton = () => {
    setDeactivePopup(false);
    setDeletePopup(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.putData("/auth/users/update", null, {
        sensitive: {
          new_password: newPassword,
        },
        password: currentPassword,
      });
      if (response) {
        setMessage("Password Changed Successful");
        setChangePasswordPopup(false);
      } else {
        setMessage(response.message || "Failed to change password.");
      }
      timeOutMessage();
    } catch (error) {
      setMessage(error?.message || "An error occurred during password change.");
    } finally {
      setLoading(false);
      timeOutMessage();
    }
  };

  const actionUser = async (status) => {
    try {
      const mess =
        status === "deactivate" ? "Account Deactivated" : "Account Deleted";
      let response;

      setLoading(true);

      if (status === "deactivate") {
        response = await apiService.deactivate("/auth/users/deactivate");
      } else {
        response = await apiService.deleteData(
          `/auth/users/${status}`,
          user._id
        );
      }
      if (response) {
        // Optionally redirect to another page or reset the form
        // For example, redirect to sign-in page after successful signup
        setMessage(mess);
        // redirect to sign in
        setTimeout(() => {
          redirect();
        }, 1500);
      } else {
        setMessage(response.message || "An error occurred!");
      }
      setLoading(false);
      cancelButton();
      timeOutMessage();
      return;
    } catch (error) {
      if (error && error?.message.includes("deactivated")) {
        setMessage(
          "Account deactivated! Please use forget password to activate."
        );
      } else {
        setMessage(error?.message || "An error occurred during submission.");
      }
      setLoading(false);
      cancelButton();
      timeOutMessage();
      return;
    }
  };

  return (
    <>
      {error ? (
        <Error401 error={error} redirect={redirect} />
      ) : (
        <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5 h-[100dvh]">
          <AsideMenu user={user} setUser={setUser} />
          <div className="relative flex flex-col gap-6 rounded bg-white m-4 mt-14 p-4 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem] lg:h-[12rem]">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              <p>Change Your Current Password</p>
              <button
                onClick={() => setChangePasswordPopup(true)}
                className="w-[140px] bg-primary text-white px-4 py-3 rounded border-0 shadow-sm"
              >
                Change Password
              </button>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              <p>Deactivate your Account</p>
              <button
                onClick={() => setDeactivePopup(true)}
                className="w-[100px] bg-yellow-500 text-white px-4 py-3 rounded border-0 shadow-sm"
              >
                Deactivate
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <p>Delete your Account</p>
              <button
                onClick={() => setDeletePopup(true)}
                className="w-[100px] bg-red-500 text-white px-4 py-3 rounded border-0 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
          {/* deactivate */}
          {deactivePopup && (
            <div className="fixed inset-0 h-[100dvh] flex flex-col items-center justify-center bg-white bg-opacity-80 p-4 z-10">
              <div className="bg-white p-6 rounded-3xl shadow-2xl w-[30rem]">
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to deactivate your account? You will be
                  logged out and clicking Forget Password will allow you to log
                  in again.
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className={`${
                      loading && "opacity-50 cursor-not-allowed"
                    } px-6 py-3 text-white bg-yellow-500 hover:bg-opacity-80 rounded border-0`}
                    onClick={() => actionUser("deactivate")}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : (
                      "Deactivate"
                    )}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 text-primary bg-white hover:bg-opacity-0 rounded border-0"
                    onClick={cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* delete */}
          {deletePopup && (
            <div className="fixed inset-0 h-[100dvh] flex flex-col items-center justify-center bg-white bg-opacity-80 p-4 z-10">
              <div className="bg-white p-6 rounded-3xl shadow-2xl w-[30rem]">
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to delete your account? You will lose
                  all your data.
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className={`${
                      loading && "opacity-50 cursor-not-allowed"
                    } px-6 py-3 text-white bg-red-500 hover:bg-opacity-80 rounded border-0`}
                    onClick={() => actionUser("delete")}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 text-primary bg-white hover:bg-opacity-0 rounded border-0"
                    onClick={cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* change password */}
          {changePasswordPopup && (
            <div className="fixed inset-0 h-[100dvh] flex flex-col items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm p-4 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
                <h3 className="text-xl font-bold text-gray-800">
                  Change Password
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Please enter your current password to set a new one.
                </p>
                <form
                  onSubmit={handleChangePassword}
                  className="mt-6 space-y-5"
                >
                  {/* Current Password Field */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-1"
                      htmlFor="currentPassword"
                    >
                      Current Password
                    </label>
                    <div className="relative group">
                      {/* Lock Icon (Left) */}
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400 group-focus-within:text-primary" />
                      </div>

                      <input
                        type={showCurrent ? "text" : "password"}
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-10 py-2.5 border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />

                      {/* Eye Icon (Right) */}
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute inset-y-0 right-0 p-2 border-solid border-l-0 border-gray-300 rounded-tr-lg rounded-br-lg flex items-center text-gray-400 bg-transparent hover:text-gray-600 focus:outline-none focus:border-none group-focus-within:border-primary group-focus-within:text-primary cursor-pointer"
                      >
                        {showCurrent ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-1"
                      htmlFor="newPassword"
                    >
                      New Password
                    </label>
                    <div className="relative group">
                      {/* Lock Icon (Left) */}
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400 group-focus-within:text-primary" />
                      </div>

                      <input
                        type={showNew ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-10 py-2.5 border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />

                      {/* Eye Icon (Right) */}
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute inset-y-0 right-0 p-2 border-solid border-l-0 border-gray-300 rounded-tr-lg rounded-br-lg flex items-center text-gray-400 bg-transparent hover:text-gray-600 focus:outline-none focus:border-none group-focus-within:border-primary group-focus-within:text-primary cursor-pointer"
                      >
                        {showNew ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons Container */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${
                        loading
                          ? "opacity-75 cursor-not-allowed"
                          : "hover:shadow-md"
                      }`}
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin text-white h-5 w-5" />
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-slate-300 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                    onClick={() => setChangePasswordPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {message && (
            <DashboardToast message={message} setMessage={setMessage} />
          )}
        </div>
      )}
    </>
  );
};

export default SettingsBody;
