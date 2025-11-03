import vision from "../../assets/about-page/vision.png";
import mission from "../../assets/about-page/mission.png";
import BlurEllipse from "../../components/BlurEllipse";

const MissionVision = (props) => {
  return (
    <section className="flex flex-col justify-center items-center bg-[#4D0B5E] sm:bg-white -mx-5 p-8 text-center gap-6 lg:gap-10 sm:mx-0 my-8 sm:mt-10 sm:p-0">
      <h1 className="font-[700] lg:text-[32px] text-[#ffffff]/50 sm:text-black">
        <span className="text-white sm:text-[#4D0B5E]">Mission</span> and{" "}
        <span className="text-white sm:text-[#4D0B5E]">Vision</span>
      </h1>
      <div className="flex flex-col gap-8">
        <div className="flex lg:justify-around gap-10">
          <img
            className="hidden sm:block w-[300px] lg:w-[400px]"
            src={vision}
            alt="mission-vision"
          />
          <article className="flex flex-col gap-2 text-sm lg:text-base text-[#3F404AB2] sm:w-[60%] lg:w-[40%]">
            <h2 className="text-left text-[#ffffff]/50 sm:text-black">
              Our <span className="text-white sm:text-[#4D0B5E]">Vision</span>
            </h2>
            <p className="text-justify text-white sm:text-[#3F404AB2] sm:text-opacity-70">
              A world where menstrual health is liberated from stigma, where
              cycle data unlocks personalized care, and where every female feels
              equipped to champion their well-being without compromise or shame.
            </p>
          </article>
        </div>
        <div className="flex sm:flex-row-reverse lg:justify-around gap-10">
          <img
            className="hidden sm:block w-[300px] lg:w-[400px] relative -top-24"
            src={mission}
            alt="mission-vision"
          />
          <article className="flex flex-col gap-2 text-sm lg:text-base text-[#3F404AB2] sm:w-[60%] sm:relative sm:top-10 lg:w-[40%]">
            <h2 className="text-right sm:text-left text-[#ffffff]/50 sm:text-black">
              Our <span className="text-white sm:text-[#4D0B5E]">Mission</span>
            </h2>
            <p className="text-justify text-white sm:text-[#3F404AB2] sm:text-opacity-70">
              To empower every female with intuitive, private, and
              scientifically grounded tools — transforming cycle tracking into a
              journey of self-knowledge, health advocacy, and unapologetic
              ownership of their body.
            </p>
          </article>
        </div>
      </div>
      <BlurEllipse position="-left-32 top-[20rem]" />
    </section>
  );
};

export default MissionVision;
