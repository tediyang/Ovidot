import React from "react";
import profile from "../../assets/landing-page/profile-pic.svg";
function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Soph A.",
      email: "example@email.com",
      message:
        "Accurate, informative, easy to use! The clean and fun design makes tracking your cycle, dare i say, fun?",
    },
    {
      id: 2,
      name: "Soph A.",
      email: "example@email.com",
      message:
        "Great Platform! Ovidot has helped me track my irregular period and find the pattern and increase my knowledge of my cycle?",
    },
    {
      id: 3,
      name: "Soph A.",
      email: "example@email.com",
      message:
        "I love Ovidot, lets me log my temp., how i’m feeling and obviously when i’m ovulating and on my period.",
    },
  ];
  return (
    <main className="w-full">
      {/* section 1 */}
      <section className=" bg-primary bg-opacity-5 py-10">
        <div className="w-[90%] mx-auto text-center flex flex-col gap-4 justify-center items-center">
          <h4 className="text-xl text-[#3F404A]">Our Testimonials</h4>
          <h1 className="text-2xl text-black font-bold">
            Hear from Our <span className="text-primary">Satisfied Users</span>
          </h1>
          <p className=" text-base text-[#3F404AB2] text-opacity-70">
            Live in sync with your cycle, from period to pregnancy with Ovidot.
            Say goodbye to poor trackers and hello to a clear, and organized
            view of your fertility calendar.
          </p>
        </div>
      </section>
      {/* section 2 */}

      <section className="w-[80%] mx-auto mt-14 flex flex-col gap-10 justify-center items-center p-4">
        {testimonials.map((testimonial) => (

          // testimonial card
            <div key={testimonial.id} className=" bg-white px-4 py-4 flex flex-col items-center gap-6 text-left rounded-md h-[18rem] shadow-testimonial-card ">
              {/* user info */}
              <div className="flex justify-start items-center gap-6 w-full">
                <img
                className="size-[4rem]"
                  src={profile}
                  alt="the user giving the testimonial"
                />
                <div>
                  <h5 className=" text-xl text-black font-bold ">{testimonial.name}</h5>
                  <p className=" text-[#706767B2] text-opacity-70">{testimonial.email}</p>
                </div>
              </div>
              {/* user testimony */}
              <div className=" text-[#3F404A99] text-opacity-60 text-lg">{testimonial.message}</div>
            </div>
        ))}
      </section>
    </main>
  );
}

export default Testimonials;
