import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminApiService } from '../../services/adminApi';
import { adminStorage } from '../../services/adminStorage';
import logo from '../../assets/ovary.png';

const AdminSigninPage = () => {
  const [formData, setFormData] = useState({ email_or_username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const flashMessage = (text, success = false) => {
    setIsSuccess(success);
    setMessage(text);
    if (!success) setTimeout(() => setMessage(''), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email_or_username || !formData.password) {
      flashMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const data = await adminApiService.login(formData);
      if (data.token || adminStorage.hasToken()) {
        flashMessage('Login successful! Redirecting…', true);
        setTimeout(() => navigate('/admin/dashboard'), 1200);
      } else {
        flashMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      flashMessage(error?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100dvh] bg-primary">
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Left panel — brand */}
        <div className="hidden lg:flex flex-col justify-center items-center basis-1/2 text-white px-12 gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/80 flex items-center justify-center">
            <img className="h-16" alt="logo" src={logo} />
          </div>
          <hgroup className="text-center">
            <h1 className="text-4xl font-extrabold leading-tight">Ovidot Admin</h1>
            <p className="text-white/70 mt-3 text-lg">
              Manage users, cycles, and platform settings from one place.
            </p>
          </hgroup>
          <div className="flex gap-6 mt-4">
            {[['Users', 'FaUsers'], ['Cycles', 'FaCalendar'], ['Settings', 'FaCog']].map(([label]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                  ✦
                </div>
                <span className="text-xs text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col justify-center basis-full lg:basis-1/2 bg-white lg:rounded-l-3xl px-8 py-12 lg:px-14 gap-6">
          <hgroup>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Admin Portal</p>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-400 mt-1 text-sm">Sign in to your admin account to continue.</p>
          </hgroup>

          {message && (
            <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
              isSuccess
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email_or_username" className="text-sm font-semibold text-gray-600">
                Email or Username
              </label>
              <input
                type="text"
                id="email_or_username"
                name="email_or_username"
                value={formData.email_or_username}
                onChange={handleChange}
                placeholder="admin@example.com or username"
                autoComplete="username"
                className="px-3 py-3 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-3 py-3 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/3 -translate-y-1/2 border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 hover:-translate-y-0.5'} w-full py-3 px-4 rounded-xl text-white bg-primary font-semibold text-sm border-0 transition-all duration-200 shadow-[0_4px_14px_rgba(77,11,94,0.3)]`}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSigninPage;
