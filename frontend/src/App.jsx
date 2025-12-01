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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
