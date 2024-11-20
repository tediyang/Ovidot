import React from "react";
import "./landing-page.css";

function LandingPage() {
  return (
    <main>

        {/* announcement section */}
      <section className=" info p-2 my-5 w-[65%] mx-auto flex justify-between items-center rounded-[0.4rem]">
        <p className=" text-[0.5rem]">
          We will soon have a mobile version, it’s still us though.
        </p>
        <p className=" text-[0.6rem] hover:cursor-pointer">Learn More</p>
      </section>

      {/* main headline section */}

      <section className=" flex flex-col gap-4 text-center">
        <div className="w-[90%] mx-auto text-center">
          <h1 className=" text-[1.2rem] text-black">
            Ovulation and Period Tracker Assistant for{" "}
            <span className="text-primary">Young Girls and Women</span>
          </h1>
        </div>
        <div className=" w-[85%] mx-auto">
          <p className=" text-[0.5rem] text-[#3F404AB2] text-opacity-70">
            Ovidot aims to revolutionize women’s health tracking by tracking
            cycle predictions, fertility insights, and comprehensive health
            guidance. Live in sync with your cycle, from period to pregnancy.
          </p>
        </div>
        <div className=" w-[30%] mx-auto flex justify-between items-center">
          <button className="bg-primary border-none px-2 py-1 rounded-[2.57px] text-white text-[0.4rem] ">
            Get Started
          </button>
          <button className="info bg-white border-[0.64px] border-[#3F404A] px-2 py-1 rounded-[2.57px] text-black text-[0.4rem]">See how it works</button>
        </div>
      </section>

      {/*  */}
      <section>
        <div className="w-[90%] mx-auto text-center flex flex-col gap-4 mt-12">
            <h5 className=" text-[#3F404A] text-sm">Our Services</h5>
            <h1 className="text-2xl">Why do Women Use <span className=" text-primary">Ovidot?</span></h1>
            <p className=" text-[8px] text-[#3F404AB2] text-opacity-70">Live in sync with your cycle, from period to pregnancy with Ovidot. Say goodbye to poor
trackers and hello to a clear, and organized view of your fertility calendar.</p>
        </div>
        
      </section>

    </main>
  );
}

export default LandingPage;
