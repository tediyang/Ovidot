import user from "../../assets/user.svg";
import profile from "../../assets/profile.svg";
import log from "../../assets/log.svg";
import pad from "../../assets/pad.svg";
import { useState, useEffect } from "react";

/**
 * A custom React hook that returns the current width of the window.
 * It sets up an event listener to update the width state whenever the window
 * is resized and cleans up the listener when the component is unmounted.
 * 
 * @returns {number} The current width of the window in pixels.
 */
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

/**
 * Steps component for the FAQ page.
 *
 * This component renders a section explaining the steps to use Ovidot.
 *
 * @returns {JSX.Element} The JSX element representing the steps component.
 */
const Steps = () => {
  const width = useWindowWidth();
  const isMobile = width < 640;

  const steps = [
    {
      id: 1,
      title: "Sign up and ",
      titleSpan: "Onboarding",
      description: "Answer some questions during the sign up process that helps to generate an accurate calendar for you. Edit your information later by going to your profile.",
      image: user
    },
    {
      id: 2,
      title: "Complete your ",
      titleSpan: "Profile",
      description: "Head over to the profile page to add and edit few of your details ( profile picture, email, number of period days).",
      image: profile
    },
    {
      id: 3,
      title: "Log your First ",
      titleSpan: "Period",
      description: "Navigate to the “Log Period” button to log your first period with us. It changes the calendar model to suit you. End the period log when your flow stops.",
      image: log
    },
    {
      id: 4,
      title: "Modify your ",
      titleSpan: "Cycle",
      description: "Over in this tab, you are able to edit your period days if it did not match with the predictive calendar. This automatically syncs and update your calendar.",
      image: pad
    }
  ];

  return (
    <div className='flex flex-col justify-center items-center text-center gap-0 my-10'>
      {
        steps.map((step) => (
          <section key={step.id} className={`flex flex-col-reverse justify-center items-center gap-10 w-full border-solid border-0 border-l-4 border-l-[#7067674D] py-8 relative ${ step.id === 4 && "before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-[#7067674D] before:-bottom-5 before:-left-3" }`}>
            <img className="w-3/12" src={step.image} alt={step.titleSpan}/>
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="border-solid border-2 bg-[#4D0B5E] rounded-full w-14 h-14 flex justify-center items-center text-white text-2xl">{step.id}</div>
              <h2 className="w-[80%]">{step.title} {isMobile && <br/>}<span className="text-[#4D0B5E]">{step.titleSpan}</span></h2>
              <p className="text-xs text-[#3F404AB2] w-[90%]">{step.description}</p>
            </div>
          </section>
        ))
      }
    </div>
  )
}

export default Steps;
