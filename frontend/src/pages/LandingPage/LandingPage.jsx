import Header from "../../components/Header";
import OurServices from "./OurServices";
import dashboardIcon from "../../assets/landing-page/dashboard1.svg";
import ActionButton from "../../components/Buttons/ActionButton";
import tick from "../../assets/landing-page/tick.svg";
import Testimonials from "./Testimonials";
import Footer from "../../components/Footer";

function LandingPage() {
  return (
    <div className="flex flex-col bg-[#ffffff] mx-5 md:mx-8 lg:mx-10">
      <Header/>
      <main className="my-10">
        {/* announcement section */}
        <section className=" shadow-info p-2 mt-4 mb-8 w-[90%] mx-auto text-center rounded-[0.4rem]">
          <p className=" text-[0.8rem]">
            We will soon have a mobile version, it’s still us though.
          </p>
        </section>

        {/* main headline section */}
        <section className=" flex flex-col gap-8 text-center ">
          <div className="w-[90%] mx-auto text-center">
            <h1 className=" text-[2.2rem] text-black">
              Ovulation and Period Tracker Assistant for{" "}
              <span className="text-primary">Young Girls and Women</span>
            </h1>
          </div>
          <div className=" w-[85%] mx-auto">
            <p className=" text-[1.5rem] text-[#3F404AB2] text-opacity-70">
              Ovidot aims to revolutionize women’s health tracking by tracking
              cycle predictions, fertility insights, and comprehensive health
              guidance. Live in sync with your cycle, from period to pregnancy.
            </p>
          </div>
          <div className=" w-[90%] mx-auto flex justify-between items-center mt-5">
            <ActionButton
              text={"Get Started"}
              className={"text-white text-[1.5rem] py-4 px-4 rounded-[2.57px]"}
            />
            <button className="shadow-info bg-white border-[0.64px] border-[#3F404A] px-4 py-4 rounded-[2.57px] text-black text-[1.5rem]">
              See how it works
            </button>
          </div>
        </section>

        {/* Our Services section */}
        <section className=" my-[6rem]">
          <div className="w-[90%] mx-auto text-center flex flex-col gap-4">
            <h5 className=" text-[#3F404A] text-[2.5rem]">Our Services</h5>
            <h1 className="text-[1.7rem]">
              Why do Women Use <span className=" text-primary">Ovidot?</span>
            </h1>
            <p className=" text-[1.5rem] text-[#3F404AB2] text-opacity-70">
              Live in sync with your cycle, from period to pregnancy with
              Ovidot. Say goodbye to poor trackers and hello to a clear, and
              organized view of your fertility calendar.
            </p>
          </div>

          <OurServices />
        </section>

        {/*  */}
        <section className=" w-full bg-primary bg-opacity-5 p-6">
          <div className=" flex flex-col gap-6 text-center mx-auto ">
            <h1 className="text-[2rem]">
              Reliable and <br />{" "}
              <span className="text-primary">Intuitive.</span>{" "}
            </h1>
            <p className=" text-[#3F404AB2] text-opacity-70 text-sm">
              Embrace the intuitive and user friendly design of the dashboard,
              providing you with an efficient tool for managing and monitoring
              your cycle.
            </p>
            <ActionButton
              text={"Get Started"}
              className={"text-white p-2 rounded-md"}
            />
          </div>
        </section>

        {/*  */}
        <section className=" w-[90%] mx-auto my-14">
          <img
            className=" w-full border-[6px] border-[#4D0B5E80] border-opacity-50"
            src={dashboardIcon}
            alt="A screenshot of the app dashboard"
          />
        </section>

        {/*  */}
        <section className="text-center flex flex-col gap-4 mb-14">
          <h1 className=" text-4xl">
            Personalize with <br />{" "}
            <span className="text-primary">Modify Cycle.</span>
          </h1>

          <div className=" flex flex-col gap-2 text-sm text-left w-[80%] mx-auto">
            {/* row1 */}
            <div className=" flex justify-between items-center gap-4">
              <img src={tick} alt="" />
              <p>
                Compare and edit your actual period days with our calculated and
                predicted days.
              </p>
            </div>
            {/* row2 */}
            <div className=" flex justify-between items-center gap-4">
              <img src={tick} alt="" />
              <p>It helps to give a more accurate result for your body.</p>
            </div>
            {/* row3 */}
            <ActionButton text={"Get Started"} className={'text-white p-2 rounded-md'}/>
          </div>
        </section>

        {/*  */}
        <Testimonials />

      </main>
      <Footer/>
    </div>
  );
}

export default LandingPage;
