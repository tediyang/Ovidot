// import "./about.css";
import HeaderImage from "../../images/wallpaper.png";
import Header from "../../components/Header";
import StoryImage from "../../images/flowers.png";
import VisionImage from "../../images/calendar.jpeg";
import goalImage from "../../images/happy.jpeg";
import MainHeader from "../../components/MainHeader";
import "../register/register.css";
import { Link } from "react-router-dom";
const Settings = () => {
  return (
    <>
      <Header title="General Information" image={HeaderImage}>
        Update your info
      </Header>

      <section className="section about__story">
        <div className="container about__story-container">
          <div className="about__section-image">
            <img src={StoryImage} alt="Our Story Image" />
          </div>

          <div className="about__section-content">
            <h1>General Information</h1>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>First Name</label>
              <input />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Last Name</label>
              <input />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Email</label>
              <input />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Address</label>
              <input />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Age</label>
              <input />
            </div>
            <Link to="#" className="button">
              Update
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Settings;
