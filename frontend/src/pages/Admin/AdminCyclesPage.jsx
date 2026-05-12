import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight,
  FaTrash, FaSpinner, FaCalendarAlt
} from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import AdminAsideMenu from '../../components/AdminAsideMenu';
import DashboardToast from '../Dashboard/DashboadToast';
import { adminApiService } from '../../services/adminApi';
import { adminStorage } from '../../services/adminStorage';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const AdminCyclesPage = () => {
  const navigate = useNavigate();

  const payload = adminStorage.getPayload();
  const username = payload?.username || 'Admin';
  const role = payload?.role || '';
  const isSuperAdmin = role === 'SUPER ADMIN';

  const [cycles, setCycles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [haveNextPage, setHaveNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const [filters, setFilters] = useState({ month: '', year: '', period: '', days: '' });
  const [applied, setApplied] = useState({});

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchCycles = useCallback(async (pg = 1, activeFilters = {}) => {
    setLoading(true);
    try {
      const params = { page: pg, size: 20, ...activeFilters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const data = await adminApiService.getCycles(params);
      setCycles(data.cycles || []);
      setHaveNextPage(data.have_next_page);
      setTotalPages(data.total_pages);
    } catch (err) {
      if (err?.message?.includes('Session expired')) navigate('/admin/sign-in');
      else flashToast(err?.message || 'Failed to load cycles.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!adminStorage.hasToken() || adminStorage.isExpired()) {
      navigate('/admin/sign-in');
      return;
    }
    fetchCycles(1, {});
  }, [navigate, fetchCycles]);

  const applyFilters = () => {
    const active = {};
    if (filters.month) active.month = filters.month;
    if (filters.year) active.year = filters.year;
    if (filters.period) active.period = filters.period;
    if (filters.days) active.days = filters.days;
    setApplied(active);
    setPage(1);
    fetchCycles(1, active);
  };

  const clearFilters = () => {
    setFilters({ month: '', year: '', period: '', days: '' });
    setApplied({});
    setPage(1);
    fetchCycles(1, {});
  };

  const goPage = (p) => {
    setPage(p);
    fetchCycles(p, applied);
  };

  const openDetail = async (cycleId) => {
    setDetailLoading(true);
    try {
      const data = await adminApiService.getCycle(cycleId);
      setSelected(data.cycle);
    } catch (err) {
      flashToast(err?.message || 'Failed to load cycle detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (cycleId) => {
    if (!window.confirm('Delete this cycle? This cannot be undone.')) return;
    try {
      await adminApiService.deleteCycle(cycleId);
      flashToast('Cycle deleted successfully.');
      setSelected(null);
      fetchCycles(page, applied);
    } catch (err) {
      flashToast(err?.message || 'Failed to delete cycle.');
    }
  };

  const fmt = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    return isNaN(d) ? val : d.toLocaleDateString();
  };

  return (
    <div className="bg-[#FDF4FF] mt-5">
      <AdminHeader page="Cycles" username={username} role={role} />
      <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5">
        <AdminAsideMenu username={username} role={role} />
        <div className="flex flex-col m-4 mt-14 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem] gap-5">

          {/* Filter bar */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Filter Cycles</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select
                value={filters.month}
                onChange={e => setFilters(p => ({ ...p, month: e.target.value }))}
                className="px-3 py-2 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              >
                <option value="">All months</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input
                type="number"
                placeholder="Year (e.g. 2024)"
                value={filters.year}
                onChange={e => setFilters(p => ({ ...p, year: e.target.value }))}
                min="1970" max="2100"
                className="px-3 py-2 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              />
              <input
                type="number"
                placeholder="Period (days)"
                value={filters.period}
                onChange={e => setFilters(p => ({ ...p, period: e.target.value }))}
                min="2" max="8"
                className="px-3 py-2 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              />
              <input
                type="number"
                placeholder="Cycle length"
                value={filters.days}
                onChange={e => setFilters(p => ({ ...p, days: e.target.value }))}
                min="18" max="38"
                className="px-3 py-2 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={applyFilters}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <FaSearch size={12} /> Filter
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
            ) : cycles.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12">No cycles found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#f3e8ff]">
                      {['Month', 'Year', 'Period', 'Days', 'Start Date', 'Ovulation', 'Next Date', ''].map((h, i) => (
                        <th key={i} className="px-5 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cycles.map(c => (
                      <tr
                        key={c._id}
                        className="border-b border-[#f3e8ff] hover:bg-[#fdf4ff] transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt size={12} className="text-primary" />
                            {c.month}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-500">{c.year}</td>
                        <td className="px-5 py-3 text-gray-500">{c.period}d</td>
                        <td className="px-5 py-3 text-gray-500">{c.days}</td>
                        <td className="px-5 py-3 text-gray-500">{fmt(c.start_date)}</td>
                        <td className="px-5 py-3 text-gray-500">{fmt(c.ovulation)}</td>
                        <td className="px-5 py-3 text-gray-500">{fmt(c.next_date)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDetail(c._id)}
                              className="text-xs text-primary font-semibold border-0 bg-transparent cursor-pointer hover:underline"
                            >
                              View
                            </button>
                            {isSuperAdmin && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}
                                className="text-red-400 border-0 bg-transparent cursor-pointer hover:text-red-600 transition-colors"
                              >
                                <FaTrash size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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

      {/* Cycle detail modal */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e8ff]">
              <h3 className="font-bold text-gray-800 text-sm">Cycle Detail</h3>
              <button onClick={() => setSelected(null)} className="border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-700">
                <FaTimes size={18} />
              </button>
            </div>
            {detailLoading ? (
              <div className="flex justify-center py-10">
                <FaSpinner className="animate-spin text-primary" size={24} />
              </div>
            ) : selected ? (
              <div className="px-6 py-5 flex flex-col gap-4">
                {/* Period badge */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FDF4FF] flex items-center justify-center">
                    <FaCalendarAlt size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{selected.month} {selected.year}</h4>
                    <p className="text-xs text-gray-400">{selected.days}-day cycle · {selected.period}-day period</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    ['Start Date', fmt(selected.start_date)],
                    ['Ovulation', fmt(selected.ovulation)],
                    ['Next Period', fmt(selected.next_date)],
                    ['Cycle Days', selected.days],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-[#FDF4FF] rounded-xl px-4 py-3">
                      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
                      <p className="font-bold text-gray-800">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Ranges */}
                {selected.period_range?.length > 0 && (
                  <div className="bg-[#FDF4FF] rounded-xl px-4 py-3 text-sm">
                    <p className="text-xs text-gray-400 font-medium mb-2">Period Range</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.period_range.map((d, i) => (
                        <span key={i} className="bg-white border border-[#e9d5f5] rounded-lg px-2 py-1 text-xs text-gray-600">{fmt(d)}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selected.ovulation_range?.length > 0 && (
                  <div className="bg-[#FDF4FF] rounded-xl px-4 py-3 text-sm">
                    <p className="text-xs text-gray-400 font-medium mb-2">Ovulation Range</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.ovulation_range.map((d, i) => (
                        <span key={i} className="bg-white border border-[#e9d5f5] rounded-lg px-2 py-1 text-xs text-gray-600">{fmt(d)}</span>
                      ))}
                    </div>
                  </div>
                )}

                {isSuperAdmin && (
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-200 cursor-pointer hover:bg-red-500 hover:text-white transition-colors w-fit"
                  >
                    <FaTrash size={12} /> Delete Cycle
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {toast && <DashboardToast message={toast} />}
    </div>
  );
};

export default AdminCyclesPage;
