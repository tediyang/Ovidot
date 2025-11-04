import DashboardCalender from "./DashboardCalender";
import CreateCycle from "./CreateCycle";
import ModifyCycle from "./ModifyCycle";
import calendarPop from "../../assets/dashboard/calendar_pop.png";
import periodPop from "../../assets/dashboard/period_pop.png";
import { getTips } from "./DashboardHelper";
import { useState } from "react";
import AsideMenu from "../../components/AsideMenu";
import Error401 from "../Errors/Error401";

const DashboardBody = ({ user, error, setError, redirect }) => {
  const [dayPop, setDayPop] = useState(null);
  const [hasCycle, setHasCycle] = useState(false);
  const [createCycle, setCreateCycle] = useState(false);
  const [modifyCycle, setModifyCycle] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(null);

  // Get current month short and day
  const month = new Date().toLocaleString("default", { month: "short" });
  const day = new Date().getDate();

  const handleCreateCycle = () => {
    setCreateCycle(!createCycle);
  }

  const handleModifyCycle = () => {
    setModifyCycle(!modifyCycle);
  }

  return (
    <>
      {error ? (
        <Error401
          error={error}
          redirect={redirect}
        />
      ) : 
      (
        <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5">
          <AsideMenu />
          <div className="flex flex-col rounded bg-white m-4 mt-14 p-4 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem]">
            <hgroup>
              <h3>
                Hi{" "}
                {user?.name.fname[0].toUpperCase() + user?.name.fname.slice(1)},
                Welcome!
              </h3>
              <hr className="my-4" />
            </hgroup>
            <div className="lg:flex lg:gap-5">
              <DashboardCalender
                setError={setError}
                setDayPop={setDayPop}
                setHasCycle={setHasCycle}
                setCurrentCycle={setCurrentCycle}
              />
              <div className="flex flex-col sm:flex-row sm:gap-5 lg:flex-col justify-center items-center lg:justify-around xl:justify-between">
                <div className="self-center relative flex w-full max-w-xl sm:min-h-48 lg:min-h-40 xl:min-h-48 mt-8 gap-2 bg-[#4D0B5E33] rounded-[15px] p-4">
                  <section className="flex flex-col sm:justify-between gap-4">
                    <div className="flex flex-col gap-1 w-[70%] xsm:w-full">
                      <h4 className="text-sm xxsm:text-base font-[700] text-primary">
                        {dayPop?.eventName || "No Event"}
                      </h4>
                      <p className="text-xs  font-[500] text-[#3F404A] sm:w-48">
                        {dayPop?.tip || getTips("safe_days")}
                      </p>
                    </div>
                    <h4 className="text-sm xxsm:text-base font-[700] w-[3.5rem] text-primary border-solid border-0 border-t-2 border-primary">
                      {month} {day}
                    </h4>
                  </section>
                  <section className="absolute top-3 right-4 lg:top-14 xl:top-3">
                    <div
                      className={`flex justify-center items-center rounded-full p-4 bg-[#1d03241a] ${
                        dayPop?.eventName && "animate-pulse"
                      }`}
                    >
                      <img
                        src={calendarPop}
                        alt="calendar"
                        className="h-16 w-16 p-2 rounded-full bg-[#cb37f01a]"
                      />
                    </div>
                  </section>
                </div>
                <div className="self-center relative flex w-full max-w-xl xl:min-w-[20rem] sm:min-h-48 lg:min-h-40 xl:min-h-48 mt-8 gap-2 bg-[#4D0B5E33] rounded-[15px] p-4">
                  <section className="flex flex-col sm:justify-between gap-4">
                    <div className="flex flex-col gap-1 w-[60%] xsm:w-[80%]">
                      <h4 className="text-sm xxsm:text-base font-[700] text-primary">
                        {hasCycle ? "MODIFY YOUR CYCLE" : "CREATE YOUR CYCLE"}
                      </h4>
                      <p className="text-xs  font-[500] text-[#3F404A] sm:w-52">
                        {hasCycle
                          ? "If your predicted days didn't match modify your cycle"
                          : "Create a new cycle for this month"}
                      </p>
                    </div>
                    {
                      hasCycle ?
                        <button className="h-10 w-[100px] font-[500] text-xs text-white bg-primary border-0 shadow-evenly rounded-[8px] font-[cabin] hover:bg-[#4D0B5E90] hover:text-white transition-colors duration-200 ease-in-out" onClick={setModifyCycle}>
                          Modify
                        </button>
                      :
                        <button className="h-10 w-[100px] font-[500] text-xs text-white bg-primary border-0 shadow-evenly rounded-[8px] font-[cabin] hover:bg-[#4D0B5E90] hover:text-white transition-colors duration-200 ease-in-out" onClick={setCreateCycle}>
                          Create
                        </button>
                    }
                  </section>
                  <section className="absolute top-5 xxsm:top-4 lg:top-14 xl:top-5 right-3">
                    <div className="flex justify-center items-center rounded-full p-4 bg-[rgba(56,54,56,0.1)]">
                      <img
                        src={periodPop}
                        alt="period"
                        className="h-16 w-16 p-2 rounded-full bg-[#4D0B5E1A]"
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          {
            createCycle && (
              <CreateCycle 
                user={user}
                setCreateCycle={handleCreateCycle}
              />
            )
          }
          {
            modifyCycle && (
              <ModifyCycle
                cycle={currentCycle}
                setModifyCycle={handleModifyCycle}
              />
            )
          }
        </div>
      )}
    </>
  );
};

export default DashboardBody;
