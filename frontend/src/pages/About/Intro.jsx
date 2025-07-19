import desktopIcon from "../../assets/about-page/desktop.png";

const Intro = () => {
  return (
    <section className="flex text-center gap-4 my-8 lg:justify-around">
      <div className="flex flex-col justify-center items-center text-center sm:text-left lg:w-[40%] gap-4">
        <h1 className="font-[700] lg:text-[32px]"><span className="text-[#4D0B5E]">Ovidot</span> - Your Modern Period Tracking Solution</h1>
        <p className="text-sm lg:text-base text-[#3F404AB2]">This is a seamless and easy to use period tracker for mostly females who are color blind, or have a color vision deficiency.</p>
      </div>
      <img
        className="hidden sm:block w-[400px] lg:w-[500px]"
        src={desktopIcon}
        alt="Desktop Intro"
      />
    </section>
  )
}

export default Intro;
