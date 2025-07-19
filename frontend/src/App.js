import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Help from "./pages/Help/Help";
import LandingPage from "./pages/LandingPage/LandingPage";
import About from "./pages/About/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;
