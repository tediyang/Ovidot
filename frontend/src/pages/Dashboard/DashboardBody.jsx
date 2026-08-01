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
          <AsideMenu user={user} />
          <div className="flex flex-col m-4 mt-14 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem] gap-5">
            {/* Welcome banner */}
            <div
              className="relative overflow-hidden rounded-2xl p-6 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #4D0B5E 0%, #7c3aed 60%, #a855f7 100%)' }}
            >
              <div className="z-0">
                <h3 className="text-lg font-bold mb-1">
                  Hi {user?.name.fname[0].toUpperCase() + user?.name.fname.slice(1)}, Welcome back! 👋
                </h3>
                <p className="text-sm opacity-80">Here's your cycle overview for {new Date().toLocaleString("default", { month: "long", year: "numeric" })}</p>
              </div>
              <div className="hidden sm:flex gap-3 z-0">
                <div className="bg-white/15 border border-white/20 rounded-xl px-4 py-2 text-center backdrop-blur-sm">
                  <p className="text-xl font-extrabold">{day}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">Today</p>
                </div>
              </div>
              {/* decorative circles */}
              <div className="absolute -top-8 -right-6 w-40 h-40 rounded-full bg-white/[0.06]" />
              <div className="absolute -bottom-12 right-16 w-28 h-28 rounded-full bg-white/[0.05]" />
            </div>

            {/* Calendar + info cards */}
            <div className="flex flex-col rounded-2xl bg-white shadow-[0_2px_16px_rgba(77,11,94,0.07)] p-4">
              <div className="lg:flex lg:gap-5">
                <DashboardCalender
                  setError={setError}
                  setDayPop={setDayPop}
                  setHasCycle={setHasCycle}
                  setCurrentCycle={setCurrentCycle}
                />
                <div className="flex flex-col sm:flex-row sm:gap-5 lg:flex-col justify-center items-center lg:justify-around xl:justify-between">
                  {/* Event info card */}
                  <div className="self-center relative flex w-full max-w-xl sm:min-h-48 lg:min-h-40 xl:min-h-48 mt-8 gap-2 bg-white border border-[#f3e8ff] rounded-2xl p-4 shadow-[0_2px_12px_rgba(77,11,94,0.07)] overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-primary to-[#a855f7]" />
                    <section className="flex flex-col sm:justify-between gap-4 pl-2">
                      <div className="flex flex-col gap-1 w-[70%] xsm:w-full">
                        <div className="w-10 h-10 rounded-xl bg-[#FDF4FF] flex items-center justify-center mb-1">
                          <img src={calendarPop} alt="calendar" className="h-6 w-6" />
                        </div>
                        <h4 className="text-sm xxsm:text-base font-[700] text-primary uppercase tracking-wide">
                          {dayPop?.eventName || "No Event"}
                        </h4>
                        <p className="text-xs font-[500] text-gray-500 sm:w-48 leading-relaxed">
                          {dayPop?.tip || getTips("safe_days")}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 bg-[#FDF4FF] border border-[#e9d5f5] rounded-lg px-2.5 py-1 text-xs font-bold text-primary w-fit">
                        📍 {month} {day}
                      </span>
                    </section>
                  </div>

                  {/* Cycle action card */}
                  <div className="self-center relative flex w-full max-w-xl xl:min-w-[20rem] sm:min-h-48 lg:min-h-40 xl:min-h-48 mt-8 gap-2 bg-white border border-[#f3e8ff] rounded-2xl p-4 shadow-[0_2px_12px_rgba(77,11,94,0.07)] overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #fb7185 0%, #e11d48 100%)' }} />
                    <section className="flex flex-col sm:justify-between gap-4 pl-2">
                      <div className="flex flex-col gap-1 w-[60%] xsm:w-[80%]">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-1">
                          <img src={periodPop} alt="period" className="h-6 w-6" />
                        </div>
                        <h4 className="text-sm xxsm:text-base font-[700] text-primary uppercase tracking-wide">
                          {hasCycle ? "MODIFY YOUR CYCLE" : "CREATE YOUR CYCLE"}
                        </h4>
                        <p className="text-xs font-[500] text-gray-500 sm:w-52 leading-relaxed">
                          {hasCycle
                            ? "If your predicted days didn't match, update your cycle for better accuracy."
                            : "Create a new cycle for this month"}
                        </p>
                      </div>
                      {hasCycle ? (
                        <button
                          className="h-10 w-[120px] font-semibold text-xs text-white border-0 rounded-xl hover:opacity-90 transition-opacity duration-200"
                          style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}
                          onClick={handleModifyCycle}
                        >
                          Modify Cycle
                        </button>
                      ) : (
                        <button
                          className="h-10 w-[120px] font-semibold text-xs text-white border-0 rounded-xl hover:opacity-90 transition-opacity duration-200"
                          style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}
                          onClick={handleCreateCycle}
                        >
                          Create Cycle
                        </button>
                      )}
                    </section>
                  </div>
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
