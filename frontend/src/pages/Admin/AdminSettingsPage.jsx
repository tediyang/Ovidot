import { useEffect, useState, useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaUserSlash,
  FaSpinner,
  FaLock,
  FaUserPlus,
  FaCopy,
  FaUser,
  FaKey,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaExclamationCircle
} from "react-icons/fa";
import config from "../../config";
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

  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");
  const [newAdmin, setNewAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [haveNextPage, setHaveNextPage] = useState(false);

  const goPage = (p) => {
    setPage(p);
    fetchAdmins(p);
  };

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

  // Change password modal state
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);
  const [changePwdForm, setChangePwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
  });

  const [pwdChecks, setPwdChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
    match: false,
  });
  const [changePwdError, setChangePwdError] = useState("");
  const [changePwdAttempted, setChangePwdAttempted] = useState(false);

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const evaluatePasswordChecks = (newPwd, confirmPwd) => {
    const length = newPwd.length >= 8;
    const uppercase = /(?=.*[A-Z])/.test(newPwd);
    const number = /(?=.*\d)/.test(newPwd);
    const special = /(?=.*[^a-zA-Z0-9])/.test(newPwd);
    const match = newPwd && newPwd === confirmPwd;
    setPwdChecks({ length, uppercase, number, special, match });
    return length && uppercase && number && special && match;
  };

  const handleNewPasswordChange = (value, field = "new") => {
    if (field === "new") {
      setChangePwdForm((p) => ({ ...p, newPassword: value }));
      setChangePwdAttempted(false);
      setChangePwdError("");
      evaluatePasswordChecks(value, changePwdForm.confirmPassword);
    } else {
      setChangePwdForm((p) => ({ ...p, confirmPassword: value }));
      setChangePwdAttempted(false);
      setChangePwdError("");
      evaluatePasswordChecks(changePwdForm.newPassword, value);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = changePwdForm;
    // Clear previous modal errors
    setChangePwdError("");
    setChangePwdAttempted(false);

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setChangePwdAttempted(true);
      setChangePwdError("Please fill in all password fields.");
      return;
    }

    const allValid = evaluatePasswordChecks(newPassword, confirmPassword);
    if (!allValid) {
      setChangePwdAttempted(true);
      setChangePwdError(
        "Please ensure the new password meets all requirements.",
      );
      return;
    }
    setChangePwdForm((p) => ({ ...p, loading: true }));
    try {
      await adminApiService.putData(config.apiEndpoints.admin.changePassword, {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });
      flashToast("Password changed successfully.");
      setChangePwdModalOpen(false);
      setChangePwdForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        loading: false,
      });
      setPwdChecks({
        length: false,
        uppercase: false,
        number: false,
        special: false,
        match: false,
      });
      setChangePwdError("");
      setChangePwdAttempted(false);
    } catch (err) {
      // Server-side / network errors: show toast
      flashToast(
        err?.message || err?.data?.message || "Failed to change password.",
      );
      setChangePwdForm((p) => ({ ...p, loading: false }));
    }
  };

  const closeChangePwdModal = () => {
    setChangePwdModalOpen(false);
    setChangePwdError("");
    setChangePwdAttempted(false);
    setChangePwdForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      loading: false,
    });
    setPwdChecks({
      length: false,
      uppercase: false,
      number: false,
      special: false,
      match: false,
    });
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

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm(`Delete this admin? This cannot be undone.`)) return;
    try {
      await adminApiService.deleteAdmin(adminId);
      flashToast('Admin deleted successfully.');
      fetchAdmins(page);
    } catch (err) {
      flashToast(err?.message || 'Failed to delete admin.');
    }
  };

  const fetchAdmins = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = { page: pg, size: 5 };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const data = await adminApiService.getAdmins(params);
      setAdmins(data.admins || []);
      setHaveNextPage(data.have_next_page);
      setTotalPages(data.total_pages);
      console.log("successfully fetched admins");
    } catch (err) {
      if (err?.message?.includes('Session expired')) navigate('/admin/sign-in');
      else setError(err?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!adminStorage.hasToken() || adminStorage.isExpired()) {
      navigate('/admin/sign-in');
      return;
    }
    isSuperAdmin && fetchAdmins(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[#FDF4FF] mt-5 h-[100dvh] lg:h-[100dvh] overflow-y-auto">
      <AdminHeader page="Settings" username={username} role={role} />
      <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5 min-h-[100dvh]">
        <AdminAsideMenu username={username} role={role} />
        <div className="flex flex-col m-4 mt-14 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem] gap-5">
          {/* Account info card */}
          <div className="flex flex-col gap-y-6 md:flex-row justify-between md:items-center bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6">
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
            <button
              onClick={() => setChangePwdModalOpen(true)}
              className="flex gap-2 items-center justify-center md:w-fit px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-opacity shadow-[0_4px_14px_rgba(77,11,94,0.2)]"
            >
              <FaKey size={13} />
              <span>Change Password</span>
            </button>
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
                    admins etc.) are only available to Super Admins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Table */}
          <div className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] ${!isSuperAdmin ? "opacity-50 pointer-events-none select-none" : ""}`}>
            {!isSuperAdmin ? (
              <div className="flex justify-center items-center px-6 py-4 border-b border-[#f3e8ff]">
                <FaExclamationCircle className="text-red-500" size={32}/>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center py-16">
                <FaSpinner className="animate-spin text-primary" size={24} />
              </div>
            ) : admins.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12">No admins found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#f3e8ff]">
                      {['Email', 'Username', 'Status', 'Role'].map(h => (
                        <th key={h} className="px-6 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(u => (
                      <tr
                        key={u._id}
                        className="border-b border-[#f3e8ff] hover:bg-[#fdf4ff] cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-3 text-gray-500">{u.email}</td>
                        <td className="px-6 py-3 text-gray-500">@{u.username}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-500">{u.role}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteAdmin(u._id); }}
                                className="text-red-400 border-0 bg-transparent cursor-pointer hover:text-red-600 transition-colors"
                              >
                                <FaTrash size={12} />
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#f3e8ff]">
                <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goPage(page - 1)}
                    disabled={page <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 cursor-pointer hover:bg-[#fdf4ff] hover:text-primary transition-colors"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() => goPage(page + 1)}
                    disabled={!haveNextPage}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 cursor-pointer hover:bg-[#fdf4ff] hover:text-primary transition-colors"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Create Admin and Switch Role */}
          <section className="flex flex-col md:flex-row gap-5">
            {/* Create Admin */}
            <div
              className={`md:basis-[50%] bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-6 md:max-w-lg ${!isSuperAdmin ? "opacity-50 pointer-events-none select-none" : ""}`}
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
                      <FaUser size={13} /> Create Admin
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

      {changePwdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeChangePwdModal}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-lg z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Change Password</h3>
              <button
                onClick={closeChangePwdModal}
                className="border-0 bg-transparent text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <FaTimes
                  size={18} 
                />
              </button>
            </div>
            <form
              onSubmit={handleChangePasswordSubmit}
              className="flex flex-col gap-4"
            >
              {changePwdError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {changePwdError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">
                  Current Password
                </label>
                <input
                  type="password"
                  value={changePwdForm.currentPassword}
                  onChange={(e) =>
                    setChangePwdForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                  onInput={() => {
                    setChangePwdAttempted(false);
                    setChangePwdError("");
                  }}
                  className={`px-3 py-2.5 border-[1.5px] border-solid rounded-xl text-sm focus:outline-none transition-colors ${changePwdAttempted && !changePwdForm.currentPassword.trim() ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">
                  New Password
                </label>
                <input
                  type="password"
                  value={changePwdForm.newPassword}
                  onChange={(e) =>
                    handleNewPasswordChange(e.target.value, "new")
                  }
                  className={`px-3 py-2.5 border-[1.5px] border-solid rounded-xl text-sm focus:outline-none transition-colors ${changePwdAttempted && (!pwdChecks.length || !pwdChecks.uppercase || !pwdChecks.number || !pwdChecks.special) ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"}`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={changePwdForm.confirmPassword}
                  onChange={(e) =>
                    handleNewPasswordChange(e.target.value, "confirm")
                  }
                  className={`px-3 py-2.5 border-[1.5px] border-solid rounded-xl text-sm focus:outline-none transition-colors ${changePwdAttempted && !pwdChecks.match ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"}`}
                />
              </div>

              <div className="text-xs">
                <p className="font-semibold mb-2">Password requirements:</p>
                <ul className="space-y-1 list-none">
                  <li
                    className={`${pwdChecks.length ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {pwdChecks.length ? "✓" : "○"} At least 8 characters
                  </li>
                  <li
                    className={`${pwdChecks.uppercase ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {pwdChecks.uppercase ? "✓" : "○"} At least one uppercase
                    letter
                  </li>
                  <li
                    className={`${pwdChecks.number ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {pwdChecks.number ? "✓" : "○"} At least one number
                  </li>
                  <li
                    className={`${pwdChecks.special ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {pwdChecks.special ? "✓" : "○"} At least one special
                    character
                  </li>
                  <li
                    className={`${pwdChecks.match ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {pwdChecks.match ? "✓" : "○"} Passwords match
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeChangePwdModal}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-sm border-0 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePwdForm.loading}
                  className={`${changePwdForm.loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold border-0 cursor-pointer transition-opacity shadow-[0_4px_14px_rgba(77,11,94,0.2)]`}
                >
                  {changePwdForm.loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={13} /> Updating…
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <DashboardToast message={toast} />}
    </div>
  );
};

export default AdminSettingsPage;
