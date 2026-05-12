import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight,
  FaTrash, FaKey, FaEdit, FaSpinner, FaCalendarAlt, FaUser
} from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import AdminAsideMenu from '../../components/AdminAsideMenu';
import DashboardToast from '../Dashboard/DashboadToast';
import { adminApiService } from '../../services/adminApi';
import { adminStorage } from '../../services/adminStorage';

const FRONT_URL = `${window.location.origin}/reset-password`;

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const payload = adminStorage.getPayload();
  const username = payload?.username || 'Admin';
  const role = payload?.role || '';
  const isSuperAdmin = role === 'SUPER ADMIN';

  // List state
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [haveNextPage, setHaveNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    fname: '', lname: '', username: '', status: '', role: '',
  });
  const [applied, setApplied] = useState({});

  // Detail panel
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  // Edit email modal
  const [editEmail, setEditEmail] = useState({ open: false, newEmail: '', loading: false });

  // Cycles sub-panel
  const [cycles, setCycles] = useState([]);
  const [cyclesLoading, setCyclesLoading] = useState(false);
  const [showCycles, setShowCycles] = useState(false);

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchUsers = useCallback(async (pg = 1, activeFilters = {}) => {
    setLoading(true);
    try {
      const params = { page: pg, size: 20, ...activeFilters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const data = await adminApiService.getUsers(params);
      setUsers(data.users || []);
      setHaveNextPage(data.have_next_page);
      setTotalPages(data.total_pages);
    } catch (err) {
      if (err?.message?.includes('Session expired')) navigate('/admin/sign-in');
      else flashToast(err?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!adminStorage.hasToken() || adminStorage.isExpired()) {
      navigate('/admin/sign-in');
      return;
    }
    // Pre-fill search from dashboard navigation
    const state = location.state;
    if (state?.searchEmail) {
      openDetail(state.searchEmail);
      navigate('/admin/users', { replace: true, state: {} });
    }
    fetchUsers(1, {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    const active = {};
    if (filters.fname) active.fname = filters.fname;
    if (filters.lname) active.lname = filters.lname;
    if (filters.username) active.username = filters.username;
    if (filters.status) active.status = filters.status;
    if (filters.role) active.role = filters.role;
    setApplied(active);
    setPage(1);
    fetchUsers(1, active);
  };

  const clearFilters = () => {
    setFilters({ fname: '', lname: '', username: '', status: '', role: '' });
    setApplied({});
    setPage(1);
    fetchUsers(1, {});
  };

  const goPage = (p) => {
    setPage(p);
    fetchUsers(p, applied);
  };

  const openDetail = async (email) => {
    setSelected(email);
    setDetail(null);
    setDetailError('');
    setDetailLoading(true);
    setShowCycles(false);
    setCycles([]);
    try {
      const data = await adminApiService.getUser(email);
      setDetail(data.user);
    } catch (err) {
      setDetailError(err?.message || 'Failed to load user.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setDetail(null);
    setShowCycles(false);
    setCycles([]);
  };

  const fetchCycles = async () => {
    if (!detail) return;
    setShowCycles(true);
    setCyclesLoading(true);
    try {
      const data = await adminApiService.getUserCycles(detail.email);
      setCycles(data.allCycles || []);
    } catch (err) {
      flashToast(err?.message || 'Failed to load cycles.');
    } finally {
      setCyclesLoading(false);
    }
  };

  const sendReset = async () => {
    if (!detail) return;
    try {
      await adminApiService.sendPasswordReset(detail.email, FRONT_URL);
      flashToast('Password reset link sent successfully.');
    } catch (err) {
      flashToast(err?.message || 'Failed to send reset link.');
    }
  };

  const handleDeleteUser = async () => {
    if (!detail || !window.confirm(`Delete ${detail.email}? This cannot be undone.`)) return;
    try {
      await adminApiService.deleteUser(detail.email);
      flashToast('User deleted successfully.');
      closeDetail();
      fetchUsers(page, applied);
    } catch (err) {
      flashToast(err?.message || 'Failed to delete user.');
    }
  };

  const handleUpdateEmail = async () => {
    if (!editEmail.newEmail.trim()) return;
    setEditEmail(p => ({ ...p, loading: true }));
    try {
      await adminApiService.updateUserEmail(detail.email, editEmail.newEmail.trim());
      flashToast('Email updated successfully.');
      setEditEmail({ open: false, newEmail: '', loading: false });
      openDetail(editEmail.newEmail.trim());
      fetchUsers(page, applied);
    } catch (err) {
      flashToast(err?.message || 'Failed to update email.');
      setEditEmail(p => ({ ...p, loading: false }));
    }
  };

  return (
    <div className="bg-[#FDF4FF] mt-5">
      <AdminHeader page="Users" username={username} role={role} />
      <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5">
        <AdminAsideMenu username={username} role={role} />
        <div className="flex flex-col m-4 mt-14 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem] gap-5">

          {/* Filter bar */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Search &amp; Filter</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
              {[['fname', 'First name'], ['lname', 'Last name'], ['username', 'Username']].map(([key, ph]) => (
                <input
                  key={key}
                  type="text"
                  placeholder={ph}
                  value={filters[key]}
                  onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
                  className="px-3 py-2 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              ))}
              <select
                value={filters.status}
                onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
                className="px-3 py-2 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="DEACTIVATED">Deactivated</option>
              </select>
              <select
                value={filters.role}
                onChange={e => setFilters(p => ({ ...p, role: e.target.value }))}
                className="px-3 py-2 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              >
                <option value="">All roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={applyFilters}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <FaSearch size={12} /> Search
              </button>
              {Object.keys(applied).length > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 text-sm font-semibold rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <FaTimes size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)]">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <FaSpinner className="animate-spin text-primary" size={24} />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#f3e8ff]">
                      {['Name', 'Email', 'Username', 'Status', 'Role', 'Cycles'].map(h => (
                        <th key={h} className="px-6 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr
                        key={u._id}
                        className="border-b border-[#f3e8ff] hover:bg-[#fdf4ff] cursor-pointer transition-colors"
                        onClick={() => openDetail(u.email)}
                      >
                        <td className="px-6 py-3 font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {u.name.fname[0].toUpperCase()}{u.name.lname[0].toUpperCase()}
                            </div>
                            {u.name.fname} {u.name.lname}
                          </div>
                        </td>
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
                        <td className="px-6 py-3 text-gray-500">{u._cycles?.length ?? 0}</td>
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

        </div>
      </div>

      {/* User detail side panel */}
      {selected && (
        <div className="fixed inset-0 z-30 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeDetail} />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e8ff] bg-white sticky top-0 z-10">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <FaUser size={13} className="text-primary" /> User Detail
              </h3>
              <button
                onClick={closeDetail}
                className="border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-700"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center items-center flex-1">
                <FaSpinner className="animate-spin text-primary" size={24} />
              </div>
            ) : detailError ? (
              <p className="text-red-500 text-sm px-6 py-8">{detailError}</p>
            ) : detail ? (
              <div className="flex flex-col gap-5 px-6 py-5 flex-1">
                {/* Avatar + identity */}
                <div className="flex flex-col items-center text-center gap-2 py-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-extrabold shadow-[0_4px_16px_rgba(77,11,94,0.25)]">
                    {detail.name.fname[0].toUpperCase()}{detail.name.lname[0].toUpperCase()}
                  </div>
                  <h4 className="font-bold text-gray-800">
                    {detail.name.fname} {detail.name.lname}
                  </h4>
                  <p className="text-xs text-gray-400">@{detail.username} · {detail.email}</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    detail.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {detail.status}
                  </span>
                </div>

                {/* Info rows */}
                <div className="bg-[#FDF4FF] rounded-xl px-4 py-4 flex flex-col gap-3 text-sm">
                  {[
                    ['Phone', detail.phone || '—'],
                    ['Date of Birth', detail.dob ? new Date(detail.dob).toLocaleDateString() : '—'],
                    ['Period Length', detail.period ? `${detail.period} days` : '—'],
                    ['Role', detail.role],
                    ['Cycles', detail._cycles?.length ?? 0],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">{label}</span>
                      <span className="text-gray-700 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={fetchCycles}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#FDF4FF] text-primary text-sm font-semibold rounded-xl border border-[#e9d5f5] cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  >
                    <FaCalendarAlt size={13} /> View Cycles
                  </button>
                  <button
                    onClick={sendReset}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#FDF4FF] text-primary text-sm font-semibold rounded-xl border border-[#e9d5f5] cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  >
                    <FaKey size={13} /> Send Password Reset
                  </button>
                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => setEditEmail({ open: true, newEmail: detail.email, loading: false })}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#FDF4FF] text-primary text-sm font-semibold rounded-xl border border-[#e9d5f5] cursor-pointer hover:bg-primary hover:text-white transition-colors"
                      >
                        <FaEdit size={13} /> Update Email
                      </button>
                      <button
                        onClick={handleDeleteUser}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-200 cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <FaTrash size={13} /> Delete User
                      </button>
                    </>
                  )}
                </div>

                {/* Cycles sub-panel */}
                {showCycles && (
                  <div className="bg-white rounded-xl border border-[#f3e8ff] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#f3e8ff] flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-700">Cycles</p>
                      <button onClick={() => setShowCycles(false)} className="border-0 bg-transparent cursor-pointer text-gray-400">
                        <FaTimes size={12} />
                      </button>
                    </div>
                    {cyclesLoading ? (
                      <div className="flex justify-center py-6">
                        <FaSpinner className="animate-spin text-primary" size={18} />
                      </div>
                    ) : cycles.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">No cycles found.</p>
                    ) : (
                      <div className="divide-y divide-[#f3e8ff] max-h-64 overflow-y-auto">
                        {cycles.map(c => (
                          <div key={c._id} className="px-4 py-3 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-semibold text-gray-700">{c.month} {c.year}</p>
                              <p className="text-gray-400">{c.days} days · period: {c.period}d</p>
                            </div>
                            <span className="text-primary font-semibold">
                              {c.start_date ? new Date(c.start_date).toLocaleDateString() : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Edit email modal */}
      {editEmail.open && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h4 className="font-bold text-gray-800 mb-1">Update Email</h4>
            <p className="text-xs text-gray-400 mb-4">Enter the new email address for this user.</p>
            <input
              type="email"
              value={editEmail.newEmail}
              onChange={e => setEditEmail(p => ({ ...p, newEmail: e.target.value }))}
              className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors mb-4"
              placeholder="new@example.com"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateEmail}
                disabled={editEmail.loading}
                className={`${editEmail.loading ? 'opacity-60 cursor-not-allowed' : ''} flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer hover:opacity-90 transition-opacity`}
              >
                {editEmail.loading ? <FaSpinner className="animate-spin" size={12} /> : null}
                Save
              </button>
              <button
                onClick={() => setEditEmail({ open: false, newEmail: '', loading: false })}
                className="px-5 py-2.5 bg-white text-gray-500 text-sm font-semibold rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <DashboardToast message={toast} />}
    </div>
  );
};

export default AdminUsersPage;
