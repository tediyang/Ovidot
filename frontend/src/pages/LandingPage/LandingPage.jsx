import React from "react";

function LandingPage() {
  return (
    <main>
      <section>
        <div className="w-[90%] mx-auto">
          <h1>
            Ovulation and Period Tracker Assistant for Young Girls and Women
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
