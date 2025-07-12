import BlurEllipse from "../../components/BlurEllipse";
import user from "../../assets/user.svg";
import profile from "../../assets/profile.svg";
import log from "../../assets/log.svg";
import pad from "../../assets/pad.svg";
import { useState, useEffect, useRef } from "react";

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
  const [ level, setLevel ] = useState(1);
  const stepRefs = useRef([]); // Create a ref array for step elements

  // Set up Intersection Observer
  useEffect(() => {
    if (isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const stepId = entry.target.dataset.id;
              setLevel(stepId)
            }
          });
        },
        {
          root: null, // relative to viewport
          threshold: 1, // trigger when 100% visible
        }
      );
  
      // Copy the current refs to a local variable
      const currentStepRefs = stepRefs.current;
  
      // Observe all step elements
      currentStepRefs.forEach(el => {
        if (el) observer.observe(el);
      });
  
      // Cleanup observer on unmount
      return () => {
        currentStepRefs.forEach(el => {
          if (el) observer.unobserve(el);
        });
      };
    };
  }, [isMobile]);

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
    <div className='flex flex-col justify-center items-center text-center gap-0 relative my-10 sm:mx-14'>
      {
        steps.map((step, index) => (
          <section
            key={step.id}
            ref={el => stepRefs.current[index] = el} // Assign ref to each element
            data-id={step.id} // Optional: store ID for reference
            className={`group flex flex-col-reverse justify-center items-center gap-10 border-solid border-0 border-l-4 transition-colors duration-300 ease-in ${ (step.id <= level && isMobile) ? "border-l-[#4D0B5E]": "border-l-[#7067674D] sm:border-l-0" } relative ${ (step.id === 4) && "before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:-bottom-5 before:-left-3 before:transition-colors before:duration-300 before:ease-in" } ${(level >= 4 && isMobile) ? "before:bg-[#4D0B5E]": "before:bg-[#7067674D]"} ${step.id % 2 !== 0 ? "sm:flex-row" : "sm:flex-row-reverse"} sm:items-stretch sm:gap-0 ${!isMobile && "sm:before:-bottom-5 sm:before:left-[calc(50%-0.63rem)] sm:hover:before:bg-[#4D0B5E]"}`}
          >
            <div className={`w-3/12 sm:basis-1/2 flex py-8 sm:border-solid sm:border-0 transition-colors duration-300 ease-in ${step.id % 2 !== 0 ? "sm:justify-end sm:pr-10 lg:pr-16 sm:border-r-2 sm:border-r-[#7067674D] sm:group-hover:border-r-[#4D0B5E]" : "sm:justify-start sm:pl-10 lg:pl-16 sm:border-l-2 sm:border-l-[#7067674D] sm:group-hover:border-l-[#4D0B5E]"}`}>
              <img className="w-[90px]" src={step.image} alt={step.titleSpan}/>
            </div>
            <div className={`flex flex-col justify-center items-center gap-3 py-8 sm:border-solid sm:border-0 transition-colors duration-300 ease-in ${step.id % 2 !== 0 ? "sm:items-start sm:justify-start sm:text-left sm:pl-10 lg:pl-16 sm:border-l-2 sm:border-l-[#7067674D] sm:group-hover:border-l-[#4D0B5E]": "sm:items-end sm:justify-end sm:text-right sm:pr-10 lg:pr-16 sm:border-r-2 sm:border-r-[#7067674D] sm:group-hover:border-r-[#4D0B5E]"} sm:items-start sm:justify-start sm:text-left sm:basis-1/2`}>
              <div className="border-solid border-2 bg-[#4D0B5E] rounded-full w-14 h-14 flex justify-center items-center text-white text-2xl">{step.id}</div>
              <h2 className="w-[80%]">{step.title} {isMobile && <br/>}<span className="text-[#4D0B5E]">{step.titleSpan}</span></h2>
              <p className="text-sm lg:text-base text-[#3F404AB2] w-[90%]">{step.description}</p>
            </div>
          </section>
        ))
      }
      <BlurEllipse />
    </div>
  )
}

export default Steps;
