import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaUserSlash,
  FaSpinner,
  FaLock,
  FaUserPlus,
  FaCopy,
} from "react-icons/fa";
import AdminHeader from "../../components/AdminHeader";
import AdminAsideMenu from "../../components/AdminAsideMenu";
import DashboardToast from "../Dashboard/DashboadToast";
import { adminApiService } from "../../services/adminApi";
import { adminStorage } from "../../services/adminStorage";

const ROLES = ["ADMIN", "SUPER ADMIN"];

const SectionHeader = ({ label }) => (
  <div className="flex items-center gap-3 mb-5">
    <h3 className="text-sm font-bold text-primary whitespace-nowrap">
      {label}
    </h3>
    <div className="flex-1 h-px bg-[#f3e8ff]" />
  </div>
);

const AdminSettingsPage = () => {
  const navigate = useNavigate();

  const payload = adminStorage.getPayload();
  const username = payload?.username || "Admin";
  const role = payload?.role || "";
  const isSuperAdmin = role === "SUPER ADMIN";

  const [toast, setToast] = useState("");
  const [newAdmin, setNewAdmin] = useState(null);

  // Switch role state
  const [createForm, setCreateForm] = useState({
    email: "",
    username: "",
    role: "ADMIN",
    password: "",
    loading: false,
  });
  // Switch role state
  const [switchForm, setSwitchForm] = useState({
    email_username_id: "",
    role: "ADMIN",
    loading: false,
  });

  // Deactivate state
  const [deactivateForm, setDeactivateForm] = useState({
    email_username_id: "",
    loading: false,
    confirm: false,
  });

  // Activate state
  const [activateForm, setActivateForm] = useState({
    email_username_id: "",
    loading: false,
    confirm: false,
  });

  // Password validation state
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const copyCredentials = async () => {
    if (!newAdmin) return;
    const text = `Email: ${newAdmin.email}\nPassword: ${newAdmin.password}`;
    try {
      await navigator.clipboard.writeText(text);
      flashToast("copied successfully.");
    } catch (err) {
      flashToast("Failed to copy credentials.");
    }
  };

  useEffect(() => {
    if (!adminStorage.hasToken() || adminStorage.isExpired()) {
      navigate("/admin/sign-in");
    }
  }, [navigate]);

  const handlePasswordValidation = (password) => {
    if (
      password.length < 8 ||
      !/(?=.*[a-z])/.test(password) || // At least one lowercase letter
      !/(?=.*[A-Z])/.test(password) || // At least one uppercase letter
      !/(?=.*\d)/.test(password) || // At least one digit
      !/(?=.*[^a-zA-Z0-9])/.test(password) // At least one special character
    ) {
      setPasswordMessage(
        "Password must be at least 8 characters long, contains at least one letter (inclusive Uppercase), one number, and one special character.",
      );
      setPasswordValid(false);
    } else {
      setPasswordMessage("Password looks good.");
      setPasswordValid(true);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (
      !createForm.email.trim() ||
      !createForm.username.trim() ||
      !createForm.password.trim()
    ) {
      flashToast("Please fill in all fields.");
      return;
    }

    if (!passwordValid) {
      flashToast("Please enter a valid password before submitting.");
      return;
    }

    setCreateForm((p) => ({ ...p, loading: true }));
    try {
      // exclude loading from the payload sent to the API
      const { loading, ...payload } = createForm;
      const response = await adminApiService.createAdmin(payload);

      // set new admin
      setNewAdmin(response.admin);

      flashToast("Admin created successfully.");
      setCreateForm({
        email: "",
        username: "",
        role: "ADMIN",
        password: "",
        loading: false,
      });
      setPasswordMessage("");
      setPasswordValid(false);
    } catch (err) {
      flashToast(err?.message || "Failed to create admin.");
      setCreateForm((p) => ({ ...p, loading: false }));
    }
  };

  const handleSwitchRole = async (e) => {
    e.preventDefault();
    if (!switchForm.email_username_id.trim()) {
      flashToast("Please enter an email, username, or ID.");
      return;
    }
    setSwitchForm((p) => ({ ...p, loading: true }));
    try {
      await adminApiService.switchRole(
        switchForm.email_username_id.trim(),
        switchForm.role,
      );
      flashToast(`Role updated to ${switchForm.role} successfully.`);
      setSwitchForm((p) => ({ ...p, email_username_id: "", loading: false }));
    } catch (err) {
      flashToast(err?.message || "Failed to switch role.");
      setSwitchForm((p) => ({ ...p, loading: false }));
    }
  };

  const handleDeactivate = async (e) => {
    e.preventDefault();
    if (!deactivateForm.email_username_id.trim()) {
      flashToast("Please enter an email, username, or ID.");
      return;
    }
    if (!deactivateForm.confirm) {
      setDeactivateForm((p) => ({ ...p, confirm: true }));
      return;
    }
    setDeactivateForm((p) => ({ ...p, loading: true }));
    try {
      await adminApiService.deactivateActivateAdmin(
        deactivateForm.email_username_id.trim(),
        "deactivate",
      );
      flashToast("Admin deactivated successfully.");
      setDeactivateForm({
        email_username_id: "",
        loading: false,
        confirm: false,
      });
    } catch (err) {
      flashToast(err?.message || "Failed to deactivate admin.");
      setDeactivateForm((p) => ({ ...p, loading: false, confirm: false }));
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!activateForm.email_username_id.trim()) {
      flashToast("Please enter an email, username, or ID.");
      return;
    }
    if (!activateForm.confirm) {
      setActivateForm((p) => ({ ...p, confirm: true }));
      return;
    }
    setActivateForm((p) => ({ ...p, loading: true }));
    try {
      await adminApiService.deactivateActivateAdmin(
        activateForm.email_username_id.trim(),
        "activate",
      );
      flashToast("Admin activated successfully.");
      setActivateForm({
        email_username_id: "",
        loading: false,
        confirm: false,
      });
    } catch (err) {
      flashToast(err?.message || "Failed to activate admin.");
      setActivateForm((p) => ({ ...p, loading: false, confirm: false }));
    }
  };

  return (
    <div className="bg-[#FDF4FF] mt-5">
      <AdminHeader page="Settings" username={username} role={role} />
      <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5 min-h-[100dvh]">
        <AdminAsideMenu username={username} role={role} />
        <div className="flex flex-col m-4 mt-14 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem] gap-5">
          {/* Account info card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-extrabold shadow-[0_4px_16px_rgba(77,11,94,0.25)]">
                {username[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {username[0].toUpperCase() + username.slice(1)}
                </h3>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                    isSuperAdmin
                      ? "bg-primary/10 text-primary"
                      : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Super admin only notice for non-super admins */}
          {!isSuperAdmin && (
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6 border-l-4 border-amber-400">
              <div className="flex items-center gap-3">
                <FaLock size={18} className="text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Super Admin required
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Admin management actions (switching roles, deactivating
                    admins) are only available to Super Admins.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Create Admin and Switch Role */}
          <section className="flex flex-col md:flex-row gap-5">
            {/* Create Admin */}
            <div
              className={`md:basis-[50%] bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6 max-w-lg ${!isSuperAdmin ? "opacity-50 pointer-events-none select-none" : ""}`}
            >
              <SectionHeader label="Create Admin" />
              <p className="text-xs text-gray-400 mb-5">
                Create a new admin account with a specified role. Only Super
                Admins can create new admin accounts.
              </p>
              <form
                onSubmit={handleCreateAdmin}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="admin@example.com"
                      className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={createForm.username}
                      onChange={(e) =>
                        setCreateForm((p) => ({
                          ...p,
                          username: e.target.value,
                        }))
                      }
                      placeholder="admin_username"
                      className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCreateForm((p) => ({ ...p, password: value }));
                        handlePasswordValidation(value);
                      }}
                      className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                    />
                    {passwordMessage && (
                      <p
                        className={`text-xs ${passwordValid ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {passwordMessage}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">
                      New Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={createForm.role}
                      onChange={(e) =>
                        setCreateForm((p) => ({ ...p, role: e.target.value }))
                      }
                      className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                    >
                      {Array(ROLES[0]).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Display admin details for user to copy if new admin was created */}
                {newAdmin && (
                  <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-green-800 mt-1">
                          Save these credentials securely; they won't be shown
                          again.
                        </p>
                      </div>
                      <FaCopy
                        className="text-green-800 cursor-pointer hover:text-green-900 transition-colors"
                        size={18}
                        onClick={copyCredentials} 
                      />
                    </div>

                    <div className="mt-3 bg-white rounded-md p-3 text-green-900">
                      <p className="text-xs">
                        <span className="font-semibold">Email:</span>{" "}
                        <span className="font-mono">{newAdmin.email}</span>
                      </p>
                      <p className="text-xs mt-1">
                        <span className="font-semibold">Password:</span>{" "}
                        <span className="font-mono">{newAdmin.password}</span>
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={createForm.loading}
                  className={`${createForm.loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} flex items-center gap-2 w-fit px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-opacity shadow-[0_4px_14px_rgba(77,11,94,0.2)]`}
                >
                  {createForm.loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={13} /> Creating…
                    </>
                  ) : (
                    <>
                      <FaShieldAlt size={13} /> Create Admin
                    </>
                  )}
                </button>
              </form>
            </div>
            {/* Switch Role */}
            <div
              className={`md:basis-[50%] bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6 ${!isSuperAdmin ? "opacity-50 pointer-events-none select-none" : ""}`}
            >
              <SectionHeader label="Switch Admin Role" />
              <p className="text-xs text-gray-400 mb-5">
                Change the role of an existing admin account. Provide their
                email address, username, or ID.
              </p>
              <form onSubmit={handleSwitchRole} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-semibold text-gray-500">
                      Email / Username / ID
                    </label>
                    <input
                      type="text"
                      value={switchForm.email_username_id}
                      onChange={(e) =>
                        setSwitchForm((p) => ({
                          ...p,
                          email_username_id: e.target.value,
                        }))
                      }
                      placeholder="admin@example.com"
                      className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-semibold text-gray-500">
                      New Role
                    </label>
                    <select
                      value={switchForm.role}
                      onChange={(e) =>
                        setSwitchForm((p) => ({ ...p, role: e.target.value }))
                      }
                      className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={switchForm.loading}
                  className={`${switchForm.loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} flex items-center gap-2 w-fit px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-opacity shadow-[0_4px_14px_rgba(77,11,94,0.2)]`}
                >
                  {switchForm.loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={13} /> Updating…
                    </>
                  ) : (
                    <>
                      <FaShieldAlt size={13} /> Update Role
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
          {/* Deactivate Admin and Activate Admin */}
          <section className="flex flex-col md:flex-row gap-5">
            {/* Deactivate Admin */}
            <div
              className={`md:basis-[50%] bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6 border-l-4 border-red-300 ${!isSuperAdmin ? "opacity-50 pointer-events-none select-none" : ""}`}
            >
              <SectionHeader label="Deactivate Admin Account" />
              <p className="text-xs text-gray-400 mb-5">
                Deactivate an admin account so they can no longer sign in. This
                cannot deactivate a Super Admin.
              </p>
              <form onSubmit={handleDeactivate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="text-xs font-semibold text-gray-500">
                    Email / Username / ID
                  </label>
                  <input
                    type="text"
                    value={deactivateForm.email_username_id}
                    onChange={(e) =>
                      setDeactivateForm((p) => ({
                        ...p,
                        email_username_id: e.target.value,
                        confirm: false,
                      }))
                    }
                    placeholder="admin@example.com"
                    className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-colors"
                  />
                </div>

                {deactivateForm.confirm && (
                  <div className="bg-red-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-700">
                    <p className="font-semibold">Are you sure?</p>
                    <p className="text-xs mt-0.5">
                      This will deactivate the admin account. Click the button
                      again to confirm.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={deactivateForm.loading}
                  className={`${deactivateForm.loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} flex items-center gap-2 w-fit px-6 py-2.5 ${
                    deactivateForm.confirm ? "bg-yellow-600" : "bg-yellow-500"
                  } text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-all`}
                >
                  {deactivateForm.loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={13} />{" "}
                      Processing…
                    </>
                  ) : (
                    <>
                      <FaUserSlash size={13} />{" "}
                      {deactivateForm.confirm
                        ? "Confirm Deactivation"
                        : "Deactivate Admin"}
                    </>
                  )}
                </button>
              </form>
            </div>
            {/* Activate Admin */}
            <div
              className={`md:basis-[50%] bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6 border-l-4 border-red-300 ${!isSuperAdmin ? "opacity-50 pointer-events-none select-none" : ""}`}
            >
              <SectionHeader label="Activate Admin Account" />
              <p className="text-xs text-gray-400 mb-5">
                Activate an admin account so they can sign in again.
              </p>
              <form onSubmit={handleActivate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="text-xs font-semibold text-gray-500">
                    Email / Username / ID
                  </label>
                  <input
                    type="text"
                    value={activateForm.email_username_id}
                    onChange={(e) =>
                      setActivateForm((p) => ({
                        ...p,
                        email_username_id: e.target.value,
                        confirm: false,
                      }))
                    }
                    placeholder="admin@example.com"
                    className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-colors"
                  />
                </div>

                {activateForm.confirm && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                    <p className="font-semibold">Are you sure?</p>
                    <p className="text-xs mt-0.5">
                      This will activate the admin account. Click the button
                      again to confirm.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={activateForm.loading}
                  className={`${activateForm.loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} flex items-center gap-2 w-fit px-6 py-2.5 ${
                    activateForm.confirm ? "bg-green-600" : "bg-green-500"
                  } text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-all`}
                >
                  {activateForm.loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={13} />{" "}
                      Processing…
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={13} />{" "}
                      {activateForm.confirm
                        ? "Confirm Activation"
                        : "Activate Admin"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>

      {toast && <DashboardToast message={toast} />}
    </div>
  );
};

export default AdminSettingsPage;
