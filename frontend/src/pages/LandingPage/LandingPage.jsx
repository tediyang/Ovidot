import Header from "../../components/Header";
import OurServices from "./OurServices";
import dashboardIcon from "../../assets/landing-page/dashboard1.png";
import dashboardIcon2 from "../../assets/landing-page/dashboard2.png";
import landingImage from "../../assets/landing-page/landing.png";
import miniImage from "../../assets/landing-page/mini.png";
import ActionButton from "../../components/Buttons/ActionButton";
import Footer from "../../components/Footer";
import tick from "../../assets/landing-page/tick.svg";
import Testimonials from "./Testimonials";
import BlurEllipse from "../../components/BlurEllipse";

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-[#ffffff] mx-5 md:mx-8 lg:mx-10">
      <Header />
      <main className="flex flex-col items-center relative my-10">
        {/* announcement section */}
        <section className="shadow-info p-2 mt-4 mb-8 max-w-[20rem] md:w-[22rem] md:max-w-[22rem] lg:w-[25rem] lg:max-w-full text-center rounded-[0.4rem]">
          <p className="text-sm text-wrap">
            We will soon have a mobile version, it&apos;s still us though.
          </p>
        </section>

        {/* main headline section */}
        <section className="flex flex-col gap-6 text-center mb-[3rem]">
          <div className="w-[90%] mx-auto text-center">
            <h1 className="font-[700] lg:text-[32px] text-black">
              Ovulation and Period Tracker Assistant for{" "}
              <span className="text-primary">Young Girls and Women</span>
            </h1>
          </div>
          <div className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto">
            <p className="text-sm lg:text-base text-[#3F404AB2] text-opacity-70">
              Ovidot aims to revolutionize women&apos;s health tracking by
              tracking cycle predictions, fertility insights, and comprehensive
              health guidance. Live in sync with your cycle, from period to
              pregnancy.
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-5">
            <ActionButton
              text={"Get started"}
              classBtn={
                "bg-white text-[#3F404A] border-[#4D0B5E] hover:bg-[#4d0B5E] hover:text-white"
              }
            />
            <ActionButton
              text={"See how it works"}
              classBtn={
                "bg-white text-[#3F404A] border-[#4D0B5E] hover:bg-[#4d0B5E] hover:text-white"
              }
            />
          </div>
        </section>

        {/* Landing Page Image */}
        <section className="hidden md:flex md:justify-center z-10">
          <img src={landingImage} alt="landing page" className="w-[90%] lg:w-[50rem]" />
        </section>

        {/* Our Services section */}
        <section className="my-[3rem]">
          <div className="w-[90%] mx-auto text-center flex flex-col lg:items-center gap-4">
            <h2 className="text-[#3F404A] text-lg">Our Services</h2>
            <h1 className="font-[700] lg:text-[32px]">
              Why do Women Use <span className="text-primary">Ovidot?</span>
            </h1>
            <p className="lg:w-[60%] text-sm lg:text-base text-[#3F404AB2] text-opacity-70">
              Live in sync with your cycle, from period to pregnancy with
              Ovidot. Say goodbye to poor trackers and hello to a clear, and
              organized view of your fertility calendar.
            </p>
          </div>
          <OurServices />
        </section>

        {/* Calender 1 */}
        <section className="md:flex md:justify-center md:relative md:w-[100dvw] md:bg-primary md:bg-opacity-5 my-[3rem] md:rounded-[20px]">
          <div className="relative">
            <div className="flex flex-col gap-6 bg-primary bg-opacity-5 md:bg-transparent md:bg-opacity-100 text-center -mx-5 rounded-[6.2px] p-6 md:ml-[0.5rem]">
              <div className="flex flex-col items-center md:items-start gap-4 md:gap-6 md:w-[40%] m-8">
                <h1 className="font-[700] lg:text-[32px]">
                  Reliable and <span className="text-primary">Intuitive.</span>{" "}
                </h1>
                <p className="md:text-left text-[#3F404AB2] text-opacity-70 text-sm lg:text-base">
                  Embrace the intuitive and user friendly design of the dashboard,
                  providing you with an efficient tool for managing and monitoring
                  your cycle.
                </p>
                <ActionButton
                  text={"Get Started"}
                  className={"text-white p-2 rounded-md"}
                />
              </div>
            </div>
            <div className="md:absolute w-[90%] md:w-[20rem] lg:w-[25rem] md:-top-[30%] md:right-[5%] lg:-top-[44%] lg:right-[5%] mx-auto my-14">
              <img
                className="w-full border-[6px] border-[#4D0B5E80] border-opacity-50"
                src={dashboardIcon}
                alt="A screenshot of the app dashboard"
              />
            </div>
            <div className="hidden md:block md:absolute w-[90%] md:w-[10rem] lg:w-[12rem] md:-bottom-[34%] md:right-[35%] lg:right-[35%] lg:-bottom-[37%] mx-auto my-14">
              <img
                className="w-full border-[6px] border-[#4D0B5E80] border-opacity-50"
                src={miniImage}
                alt="A screenshot of landing calendar"
              />
            </div>
          </div>
        </section>

        {/* Modify Cycle */}
        <section className="flex flex-col md:flex-row-reverse gap-8 text-center mb-14 md:mt-[3rem] md:mx-5">
          <div className="flex flex-col items-center md:justify-center gap-4">
            <h1 className="font-[700] lg:text-[32px]">
              Personalize with{" "}
              <span className="text-primary">Modify Cycle.</span>
            </h1>
            <div className=" flex flex-col gap-2 text-sm text-left w-[90%]">
              <div className=" flex items-center gap-4">
                <img src={tick} alt="" />
                <p className="text-[#3F404AB2] text-opacity-70">
                  Compare and edit your actual period days with our calculated
                  and predicted days.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img src={tick} alt="" />
                <p className="text-[#3F404AB2] text-opacity-70">It helps to give a more accurate result for your body.</p>
              </div>
            </div>
            <ActionButton
              text={"Get Started"}
              className={"text-white p-2 rounded-md"}
            />
          </div>
          <div className="w-[90%] md:w-[70%] mx-auto my-14 md:my-0">
            <img
              className=" w-full border-[6px] border-[#4D0B5E80] border-opacity-50"
              src={dashboardIcon2}
              alt="A screenshot of the app dashboard"
            />
          </div>
        </section>

        {/* Testiminials */}
        <Testimonials />
        <BlurEllipse position="-left-32 top-[13rem]" />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
