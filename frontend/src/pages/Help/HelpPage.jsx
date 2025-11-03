import Header from "../../components/Header";
import Intro from "./Intro";
import Steps from "./Steps";
import Footer from "../../components/Footer";


const Help = () => {
  return (
    <div className="flex flex-col bg-white mx-5 md:mx-8 lg:mx-10">
      <Header />
      <main className="flex flex-col justify-center items-center my-10">
        <Intro />
        <Steps />
      </main>
      <Footer />
    </div>
  )
}

export default Help;
