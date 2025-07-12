/**
 * Intro component for the FAQ page.
 *
 * This component renders a section introducing the instructions on how to use Ovidot.
 *
 * @returns {JSX.Element} The JSX element representing the intro component.
 */
const Intro = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center gap-4 my-8">
      <p className="font-[450] text-sm text-[#3F404A]">How It Works</p>
      <h1 className="font-[700]">Steps on How to {}<span className="text-[#4D0B5E]">Use Ovidot</span></h1>
      <p className="text-sm lg:text-base text-[#3F404AB2] sm:w-[60%]">Live in sync with your cycle, from period to pregnancy with Ovidot. Say goodbye to poor
      trackers and hello to a clear, and organized view of your fertility calendar.</p>
    </section>
  )
}

export default Intro;
