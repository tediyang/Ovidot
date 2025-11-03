import Intro from "./Intro";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MissionVision from "./MissionVision";

const About = () => {
  return (
    <div className="flex flex-col bg-[#ffffff] mx-5 md:mx-8 lg:mx-10">
      <Header />
      <main className="flex flex-col justify-center items-center my-10">
        <Intro />
        <MissionVision />
      </main>
      <Footer />
    </div>
  )
}

export default About;
