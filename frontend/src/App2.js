import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Auth from "./user/pages/Auth";
import ForgotPassword from "./user/components/ForgotPassword";
import Documentation from "./user/pages/Documentation/Documentation";
import CareerOverview from "./user/pages/careeroverview/CareerOverview";
import HumanResource from "./user/pages/hr";
import Training from "./user/pages/training";
import CourseDetails from "./user/pages/courseDetails";
import UserDashboard from "./user/pages/dashboard/UserDashboard";
import SoftSkills from "./admin/pages/softSkills";
import HrAdmin from "./admin/pages/hr/HrAdmin";
import Exam from "./user/pages/exam/Exam";
import HrExam from "./admin/pages/hr_exam/HrExam";
import ExamDone from "./user/pages/exam/ExamDone";
import JobOpening from "./user/pages/jobopening";
import MainLayout from "./user/components/MainLayout";
import Announcements from "./admin/pages/announcements/Announcements";
import Applicants from "./admin/pages/applicants/Applicants";
import ApplicantInformation from "./admin/pages/applicant-info/ApplicantInformation";
import AdminTraining from "./admin/pages/training";
import UserSoftSkills from "./user/pages/softSkills";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}

        <Route path="/" element={<MainLayout />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="/careers" element={<CareerOverview />} />
        </Route>

        <Route path="/user/*" element={<MainLayout />}>
          <Route path="profile" element={<UserDashboard />} />
          <Route path="exam" element={<Exam />} />
          <Route path="exam/done" element={<ExamDone />} />
          <Route path="human-resource" element={<HumanResource />} />
          <Route path="training" element={<Training />} />
          <Route path="course-details" element={<CourseDetails />} />
          <Route path="soft-skills" element={<UserSoftSkills />} />
        </Route>

        <Route path="/admin/*" element={<MainLayout />}>
          <Route path="HR-Admin" element={<HrAdmin />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="soft-skills" element={<SoftSkills />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="applicants/:id" element={<ApplicantInformation />} />
          <Route path="training" element={<AdminTraining />} />
          <Route path="exam" element={<HrExam />} />
        </Route>

        <Route path="/auth" element={<Auth />} />
        <Route path="/openings" element={<JobOpening />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/documentation" element={<Documentation />} />

        <Route path="/hr" element={<HumanResource />} />
        <Route path="/training" element={<Training />} />
        <Route path="/coursedetails" element={<CourseDetails />} />
        <Route path="/softskills" element={<SoftSkills />} />
      </Routes>
    </Router>
  );
};

export default App;
