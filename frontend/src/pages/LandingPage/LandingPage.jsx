import React from "react";
import './landing-page.css'

function LandingPage() {
  return (
    <main>
        <section className=" info p-2 my-5 w-[65%] mx-auto flex justify-between items-center rounded-[0.4rem]">
                <p className=" text-[0.5rem]">We will soon have a mobile version, it’s still us though.</p>
                <p className=" text-[0.6rem]">Learn More</p>
        </section>
      <section>
        <div className="w-[90%] mx-auto text-center">
          <h1 className=" text-[1.2rem] text-black">
            Ovulation and Period Tracker Assistant for <span className="text-primary">Young Girls and Women</span> 
          </h1>
        </div>
        <div>
          <p>
            Ovidot aims to revolutionize women’s health tracking by tracking
            cycle predictions, fertility insights, and comprehensive health
            guidance. Live in sync with your cycle, from period to pregnancy.
          </p>
        </div>
        <div>
            <button className="bg-[#4D0B5E] border px-2 py-1 rounded-sm ">Get Started</button>
            <button>See how it works</button>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
