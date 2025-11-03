import profile from "../../assets/landing-page/profile-pic.svg";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Adebimpe Titilayo",
      message:
        "Accurate, informative, easy to use! The clean and fun design makes tracking your cycle, dare i say, fun?",
    },
    {
      id: 2,
      name: "Sophie Chiamaka",
      message:
        "Great Platform! Ovidot has helped me track my irregular period and find the pattern and increase my knowledge of my cycle?",
    },
    {
      id: 3,
      name: "Steven Darlington",
      message:
        "I love Ovidot, lets me log my temp., how i’m feeling and obviously when i’m ovulating and on my period.",
    },
  ];

  const truncateLetters = (word) => {
    return word.length > 23 ? word.slice(0, 23) + "..." : word;
  };

  return (
    <section className="flex flex-col items-center md:relative md:w-[100dvw] md:min-h-[32rem] my-[3rem]">
      {/* section 1 */}
      <div className="flex flex-col gap-6 md:w-full md:min-h-[20rem] bg-primary bg-opacity-5 text-center -mx-5 rounded-[6.2px] md:rounded-[20px]">
        <div className="flex flex-col items-center gap-4 m-8">
          <h2 className="text-[#3F404A] text-lg">Our Testimonials</h2>
          <h1 className="font-[700] lg:text-[32px]">
            Hear from Our <span className="text-primary">Satisfied Users</span>
          </h1>
          <p className="lg:w-[60%] text-sm lg:text-base text-[#3F404AB2] text-opacity-70">
            Live in sync with your cycle, from period to pregnancy with Ovidot.
            Say goodbye to poor trackers and hello to a clear, and organized
            view of your fertility calendar.
          </p>
        </div>
      </div>
      {/* section 2 */}
      <div className="w-[80%] mt-14 flex flex-col md:flex-row gap-10 justify-center items-center p-4 md:absolute md:bottom-0">
        {testimonials.map((testimonial) => (
          // testimonial card
          <div
            key={testimonial.id}
            className="md:w-[17rem] bg-white px-4 py-4 flex flex-col gap-14 items-center text-left rounded-3xl h-[18rem] shadow-testimonial-card"
          >
            {/* user info */}
            <div className="flex justify-stargt items-center gap-6 w-full">
              <img
                className="size-[4rem]"
                src={profile}
                alt="the user giving the testimonial"
              />
              <div>
                <h5 className="text-xl text-black font-bold ">
                  {truncateLetters(testimonial.name)}
                </h5>
              </div>
            </div>
            {/* user testimony */}
            <div className=" text-[#3F404A99] text-opacity-60 text-sm lg:text-base">
              {testimonial.message}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
