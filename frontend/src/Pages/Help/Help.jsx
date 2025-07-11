import Header from "../../Components/Header";
import Intro from "./Intro";
import Steps from "./Steps";
import Footer from "../../Components/Footer";


const Help = () => {
  return (
    <div className="flex flex-col bg-[#ffffff] mx-5">
      <Header />
      <main className="flex flex-col justify-center items-center">
        <Intro />
        <Steps />
      </main>
      <Footer />
    </div>
  )
}

export default Help;
