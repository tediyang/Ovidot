import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Help from "./pages/Help/HelpPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import About from "./pages/About/AboutPage";
import Signup from "./pages/Signup/SignupPage";
import Signin from "./pages/Signin/SigninPage";
import ForgetPassword from "./pages/ForgetPassword/ForgetPasswordPage";
import ResetPassword from "./pages/ForgetPassword/ResetPasswordPage";
import Dashboard from "./pages/Dashboard/DashboardPage";
import Profile from "./pages/Profile/ProfilePage";
import Settings from "./pages/Settings/SettingsPage";
import AdminSigninPage from "./pages/Admin/AdminSigninPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminCyclesPage from "./pages/Admin/AdminCyclesPage";
import AdminSettingsPage from "./pages/Admin/AdminSettingsPage";
import CompleteRegistrationPage from "./pages/CompleteRegistration/CompleteRegistrationPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* User protected routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin routes */}
        <Route path="/admin/sign-in" element={<AdminSigninPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/cycles" element={<AdminCyclesPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
