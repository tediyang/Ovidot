import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCheckCircle, FaBan, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import OvidotLoader from '../../components/Loader';
import AdminHeader from '../../components/AdminHeader';
import AdminAsideMenu from '../../components/AdminAsideMenu';
import { adminApiService } from '../../services/adminApi';
import { adminStorage } from '../../services/adminStorage';

const StatCard = ({ label, value, Icon, accent, sub }) => (
  <div className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)] p-5 border-l-4 ${accent} flex items-center gap-4`}>
    <div className="w-12 h-12 rounded-xl bg-[#FDF4FF] flex items-center justify-center flex-shrink-0">
      <Icon size={22} className="text-primary" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-gray-800">{value ?? '—'}</p>
      <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ total: null, active: null, deactivated: null, cycles: null });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const payload = adminStorage.getPayload();
  const username = payload?.username || 'Admin';
  const role = payload?.role || '';

  useEffect(() => {
    if (!adminStorage.hasToken() || adminStorage.isExpired()) {
      navigate('/admin/sign-in');
      return;
    }

    const load = async () => {
      try {
        const [total, active, deactivated, cycles, recent] = await Promise.all([
          adminApiService.getUsers({ count: true }),
          adminApiService.getUsers({ count: true, status: 'ACTIVE' }),
          adminApiService.getUsers({ count: true, status: 'DEACTIVATED' }),
          adminApiService.getCycles({ count: true }),
          adminApiService.getUsers({ page: 1, size: 8 }),
        ]);

        setStats({
          total: total.count,
          active: active.count,
          deactivated: deactivated.count,
          cycles: cycles.count,
        });
        setRecentUsers(recent.users || []);
      } catch (err) {
        if (err?.message?.includes('Session expired')) {
          navigate('/admin/sign-in');
        } else {
          setError(err?.message || 'Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  if (loading) return <OvidotLoader />;

  return (
    <div className="bg-[#FDF4FF] mt-5">
      <AdminHeader page="Dashboard" username={username} role={role} />
      <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5">
        <AdminAsideMenu username={username} role={role} />
        <div className="flex flex-col m-4 mt-14 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem] gap-6">

          {/* Welcome banner */}
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#4D0B5E 0%,#7c3aed 60%,#a855f7 100%)' }}>
            <p className="text-sm font-semibold text-white/70 uppercase tracking-widest">Admin Panel</p>
            <h2 className="text-2xl font-extrabold mt-1">Welcome back, {username} 👋</h2>
            <p className="text-white/70 text-sm mt-1">Here's what's happening on the platform today.</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={stats.total} Icon={FaUsers} accent="border-primary" />
            <StatCard label="Active Users" value={stats.active} Icon={FaCheckCircle} accent="border-green-400" />
            <StatCard label="Deactivated" value={stats.deactivated} Icon={FaBan} accent="border-red-400" />
            <StatCard label="Total Cycles" value={stats.cycles} Icon={FaCalendarAlt} accent="border-violet-400" />
          </div>

          {/* Recent users table */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(77,11,94,0.07)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e8ff]">
              <h3 className="font-bold text-gray-800 text-sm">Recent Users</h3>
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-1 text-xs text-primary font-semibold border-0 bg-transparent cursor-pointer hover:underline"
              >
                View all <FaArrowRight size={10} />
              </button>
            </div>
            <div className="overflow-x-auto">
              {recentUsers.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No users found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#f3e8ff]">
                      <th className="px-6 py-3 font-semibold">Name</th>
                      <th className="px-6 py-3 font-semibold">Email</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Cycles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-[#f3e8ff] hover:bg-[#fdf4ff] cursor-pointer transition-colors"
                        onClick={() => navigate('/admin/users', { state: { searchEmail: u.email } })}
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
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-500">{u._cycles?.length ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
