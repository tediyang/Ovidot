import { apiService } from "../../services/api";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { getFullMonth, getTips } from "./DashboardHelper";
import ovulation from "../../assets/dashboard/ovulation.png";
import ovulationWhite from "../../assets/dashboard/ovulation_white.png";
import ovulationGreen from "../../assets/dashboard/ovulation_green.png";
import period from "../../assets/dashboard/period.png";
import periodWhite from "../../assets/dashboard/period_white.png";
import calendar from "../../assets/dashboard/calendar.png";
import calendarWhite from "../../assets/dashboard/calendar_white.png";
import unsafe from "../../assets/dashboard/unsafe.png";
import unsafeWhite from "../../assets/dashboard/unsafe_white.png";


const DashboardCalendar = ({ setError, setDayPop, setHasCycle }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cycles, setCycles] = useState([]);
  const [adjacentCycles, setAdjacentCycles] = useState({});
  const [todayEvent, setTodayEvent] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const todayRef = useRef(null);

  // Extract year and month for cleaner dependencies
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const fetchCycleData = useCallback(
    async (year) => {
      try {
        const response = await apiService.getData(
          `/auth/cycles/getall?year=${year}`
        );
        setCycles(response);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching cycle data:", err);
        setCycles([]);
      }
    },
    [setError]
  );

  const fetchAdjacentCycleData = useCallback(async (month, year) => {
    const key = `${year}-${month}`;

    if (adjacentCycles[key]) return;

    try {
      const response = await apiService.getData(
        `/auth/cycles/getall?month=${month}&year=${year}`
      );

      setAdjacentCycles((prev) => ({
        ...prev,
        [key]: (response.cycles && response.cycles[0]) || null,
      }));
    } catch (err) {
      console.error("Error fetching adjacent cycle data:", err);
    }
  }, []);

  useEffect(() => {
    fetchCycleData(currentYear);
  }, [currentYear, fetchCycleData]);

  useEffect(() => {
    /** Fetch adjacent month data (API call), if user is on the first
     * or last month of a year then fetch adjacent year month
     */
    if (currentMonth === 0) {
      fetchAdjacentCycleData("December", currentYear - 1);
    } else if (currentMonth === 11) {
      fetchAdjacentCycleData("January", currentYear + 1);
    }
  }, [currentMonth, currentYear, fetchAdjacentCycleData]);

  // check if user has a cycle for the current month
  const hasCycle = useMemo(() => {
    return cycles?.some(
      (cycle) =>
        (cycle &&
          new Date(cycle.start_date).getMonth() === currentMonth &&
          new Date(cycle.start_date).getFullYear() === currentYear) ||
          new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000) <= new Date(cycle.next_date) // 5 days before next date
    );
  }, [cycles, currentMonth, currentYear, currentDate]);

  useEffect(() => {
    setHasCycle(hasCycle);
  }, [hasCycle, setHasCycle]);

  /**
   * Get the number of days in a given month.
   * @param {Date} date - The date object of the month.
   * @returns {number} The number of days in the month.
   */
  const getDaysInMonth = useCallback((date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }, []);

  /**
   * Returns the day of the week of the first day of a given month.
   * @param {Date} date - The date object of the month.
   * @returns {number} The day of the week (0-6), where 0 is Sunday, 1 is Monday, etc.
   */
  const getFirstDayOfMonth = useCallback((date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }, []);

  const goToPreviousMonth = () => {
    setIsTransitioning(true);
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
    // Use timeout to ensure transition state is reset after render
    setTimeout(() => setIsTransitioning(false), 0);
  }

  const goToNextMonth = () => {
    setIsTransitioning(true);
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
    // Use timeout to ensure transition state is reset after render
    setTimeout(() => setIsTransitioning(false), 0);
  };

  /**
   * Format a day of the month for event checking (e.g. finding a date in the user's events array).
   *
   * @param {number} day - Day of the month (1-indexed)
   * @returns {string} - ISO-formatted date string (YYYY-MM-DD)
   */
  const formatDateForEventCheck = useCallback((day) => {
    const month = currentMonth + 1;
    return `${currentYear}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }, [currentYear, currentMonth]);

  const memoizedCalendarData = useMemo(() => {
    /**
     * Returns the day of the week for a given day of the month, relative to today.
     * @param {number} day - Day of the month (1-indexed)
     * @returns {string} - Day of the week (e.g. "Monday", "Today", "Tomorrow")
     */

    if (isTransitioning) {
      return []; // Return empty during transition to prevent flicker
    }

    const dayOfTheWeek = (day) => {
      const newDate = new Date(currentYear, currentMonth, day);
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

      if (new Date().toDateString() === newDate.toDateString()) {
        return "Today";
      } else if (tomorrow.toDateString() === newDate.toDateString()) {
        return "Tomorrow";
      }
      return newDate.toLocaleString("default", { weekday: "long" });
    };

    const daysInMonth = getDaysInMonth(currentDate);
    // const startingDay = getStartingDay(currentDate);
    const calendarDays = [];
    let todayEventData = null;

    const allCycles = [...cycles];

    // If user is on the first or last month of a year then fetch adjacent year month (use data in state)
    if (currentMonth === 0) {
      const decCycle = adjacentCycles[`${currentYear - 1}-December`];
      if (decCycle) allCycles.push(decCycle);
    } else if (currentMonth === 11) {
      const janCycle = adjacentCycles[`${currentYear + 1}-January`];
      if (janCycle) allCycles.push(janCycle);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = formatDateForEventCheck(i);
      const isToday =
        i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear();

      const cycleDay = {
        day: i,
        dayOfWeek: dayOfTheWeek(i),
        hasEvent: false,
        eventName: null,
        dateString: dateString,
        isToday: isToday,
      };

      allCycles.forEach((cycle, index) => {
        if (!cycle) return;

        const dateStringTime = new Date(dateString).getTime();

        if (
          cycle.ovulation &&
          new Date(cycle.ovulation).getTime() === dateStringTime
        ) {
          cycleDay.hasEvent = true;
          cycleDay.eventName = "OVULATION DATE";
          return;
        }

        /** Check if the cycle is the last cycle created by the user, then include the next date
         *  This is done to prevent the previous cycle next date data from appearing in the current
         *  Cycle
         */
        if (index+1 === allCycles.length &&
          cycle.next_date &&
          new Date(cycle.next_date).getTime() === dateStringTime
        ) {
          cycleDay.hasEvent = true;
          cycleDay.eventName = "NEXT PERIOD DATE";
          return;
        }

        if (
          cycle.period_range?.some(
            (date) => date && new Date(date).getTime() === dateStringTime
          )
        ) {
          cycleDay.hasEvent = true;
          cycleDay.eventName = "PERIOD";
          return;
        }

        if (
          cycle.ovulation_range?.some(
            (date) => date && new Date(date).getTime() === dateStringTime
          )
        ) {
          cycleDay.hasEvent = true;
          cycleDay.eventName = "EXPECT OVULATION";
          return;
        }

        if (
          cycle.unsafe_days?.some(
            (date) => date && new Date(date).getTime() === dateStringTime
          )
        ) {
          cycleDay.hasEvent = true;
          cycleDay.eventName = "FERTILE WINDOW";
        }
      });

      /**Get the mini day data for today popup and tips.
       * First check if there's an event and it's today
       * Then compare the dateString to each cycle eventName data
       * once they match populate the dayPop.
       */
      if (cycleDay.hasEvent && cycleDay.isToday) {
        const dayPopData = {
          eventName: null,
          tip: null,
        };

        const cycle = cycles.find(
          (cycle) => cycle.month === getFullMonth(new Date().getMonth())
        );

        if (cycleDay.eventName === "PERIOD") {
          cycle?.period_range?.some((date, index) => {
            if (
              date &&
              new Date(date).getTime() === new Date(dateString).getTime()
            ) {
              dayPopData.eventName = `PERIOD DAY ${index + 1}`;
              dayPopData.tip = getTips("period");
              return true;
            }
            return false;
          });
        } else if (
          cycleDay.eventName === "OVULATION DATE" ||
          cycleDay.eventName === "EXPECT OVULATION"
        ) {
          cycle?.ovulation_range?.some((date, index) => {
            if (
              date &&
              new Date(date).getTime() === new Date(dateString).getTime()
            ) {
              dayPopData.eventName = "EXPECT OVULATION";
              dayPopData.tip = getTips("ovulation");
              return true;
            }
            return false;
          });
        } else if (cycleDay.eventName === "FERTILE WINDOW") {
          cycle?.unsafe_days?.some((date, index) => {
            if (
              date &&
              new Date(date).getTime() === new Date(dateString).getTime()
            ) {
              dayPopData.eventName = `FERTILE WINDOW DAY ${index + 1}`;
              dayPopData.tip = getTips("fertile_window");
              return true;
            }
            return false;
          });
        } else {
          dayPopData.eventName = "NEXT CYCLE DAY";
          dayPopData.tip = "Your next cycle may begin today";
        }

        todayEventData = dayPopData;
      }

      calendarDays.push(cycleDay);
    }

    setTodayEvent(todayEventData);
    return calendarDays;
  }, [currentDate, cycles, adjacentCycles, currentYear, currentMonth, isTransitioning, getDaysInMonth, formatDateForEventCheck]);

  // Handling Tablet and Desktop view
  const renderDays = () => {
    if (isTransitioning) {
      return (
        <div className="grid grid-cols-7 gap-1 p-2">
          {Array.from({ length: 42 }).map((_, index) => (
            <div key={index} className="p-5 flex justify-center items-center h-[5rem] w-[5.5rem] lg:h-[3rem] lg:w-[3.5rem] xl:h-[5rem] xl:w-[5.5rem] bg-white animate-pulse rounded-md">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    const totalDays = memoizedCalendarData.length;
    const firstDayIndex = getFirstDayOfMonth(currentDate);
    const days = [];

    // Fill in leading empty cells for days from the previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="p-5"></div>);
    }

    // Fill in the days of the current month
    for (let day = 1; day <= totalDays; day++) {
      const dayData = memoizedCalendarData[day - 1];
      days.push(
        <div
          key={day}
          className={`relative p-5 flex justify-center items-center h-[5rem] w-[5.5rem] lg:h-[3rem] lg:w-[3.5rem] xl:h-[5rem] xl:w-[5.5rem] cursor-pointer transition-colors duration-200 rounded-md
            ${dayData.isToday ? "bg-primary text-white font-bold"
              : dayData.eventName === "PERIOD"
              ? "bg-red-100"
              : dayData.eventName === "OVULATION DATE"
              ? "bg-[#0af52c] bg-opacity-25"
              : dayData.eventName === "EXPECT OVULATION"
              ? "bg-[#efff00] bg-opacity-25"
              : dayData.eventName === "FERTILE WINDOW"
              ? "bg-[#00ceff] bg-opacity-25"
              : dayData.eventName === "NEXT PERIOD DATE"
              ? "bg-[#d22e2e] bg-opacity-25"
              : ""
            }`}
        >
          <p>{day}</p>
          <div className="absolute right-[2px] top-[2px]">
            {dayData.isToday ? (
              dayData.eventName === "OVULATION DATE" ? (
                <img
                  src={ovulationWhite}
                  alt="ovulation"
                  className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
                />
              ) : dayData.eventName === "PERIOD" ? (
                <img
                  src={periodWhite}
                  alt="period"
                  className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
                />
              ) : dayData.eventName === "EXPECT OVULATION" ? (
                <img
                  src={ovulationWhite}
                  alt="ovulation range"
                  className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
                />
              ) : dayData.eventName === "FERTILE WINDOW" ? (
                <img
                  src={unsafeWhite}
                  alt="fertile window"
                  className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
                />
              ) : dayData.eventName === "NEXT PERIOD DATE" ? (
                <img
                  src={calendarWhite}
                  alt="ovulation"
                  className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
                />
              ) : null
            ) : dayData.eventName === "OVULATION DATE" ? (
              <img
                src={ovulationGreen}
                alt="ovulation"
                className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
              />
            ) : dayData.eventName === "PERIOD" ? (
              <img
                src={period}
                alt="period"
                className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
              />
            ) : dayData.eventName === "EXPECT OVULATION" ? (
              <img
                src={ovulation}
                alt="ovulation range"
                className="w-8 h-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
              />
            ) : dayData.eventName === "FERTILE WINDOW" ? (
              <img
                src={unsafe}
                alt="fertile window"
                className="w-8 h-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
              />
            ) : dayData.eventName === "NEXT PERIOD DATE" ? (
              <img
                src={calendar}
                alt="next date"
                className="h-8 w-8 lg:h-4 lg:w-4 xl:h-8 xl:w-8"
              />
            ) : null}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1 p-2">{days}</div>;
  };

  useEffect(() => {
    if (todayEvent) {
      setDayPop(todayEvent);
    }
  }, [todayEvent, setDayPop]);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "instant", block: "center" });
    }
  }, [memoizedCalendarData]);

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const monthShort = currentDate.toLocaleString("default", { month: "short" });

  return (
    <div className="flex flex-col items-center justify-center mt-2">
      <div className="w-full max-w-xl sm:max-w-5xl lg:max-w-full rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between p-4">
          <button
            onClick={goToPreviousMonth}
            className="h-full border-0 bg-transparent text-2xl text-primary transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h2 className="text-base xxsm:text-xl font-semibold">
            {monthName}, {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className="border-0 bg-transparent text-2xl text-primary transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
        {/* Mobile view */}
        <div className="h-[25rem] flex flex-col gap-2 overflow-y-auto border-solid border-x-0 border-y-2 border-primary sm:hidden">
          {memoizedCalendarData.map(
            (dayData, index) =>
              dayData &&
              (dayData.hasEvent ? (
                <div
                  key={index}
                  ref={dayData.isToday ? todayRef : null}
                  className={`relative flex gap-1 xxsm:gap-3 h-24 w-full shadow-md px-2 py-3 rounded-md ${
                    dayData.isToday ? "bg-primary text-white font-bold" : ""
                  }`}
                >
                  <section className="flex w-12 text-sm">
                    <h4>
                      {monthShort} {dayData.day}
                    </h4>
                  </section>
                  <section
                    className={`flex flex-col gap-3 border-solid border-0 border-l-4 pl-4 ${
                      dayData.isToday
                        ? "border-white"
                        : dayData.eventName === "PERIOD"
                        ? "border-[#ff0020] border-opacity-55"
                        : dayData.eventName === "OVULATION DATE"
                        ? "border-[#0af52c] border-opacity-55"
                        : dayData.eventName === "EXPECT OVULATION"
                        ? "border-[#efff00] border-opacity-55"
                        : dayData.eventName === "FERTILE WINDOW"
                        ? "border-[#00ceff] border-opacity-55"
                        : "border-[#d22e2e]"
                    }`}
                  >
                    <p className="text-sm">{dayData.dayOfWeek}</p>
                    <div className="flex">
                      <p className="text-xs xxsm:text-sm w-32">
                        {dayData.eventName}
                      </p>
                      <div className="absolute right-3 top-2">
                        {dayData.isToday ? (
                          dayData.eventName === "OVULATION DATE" ? (
                            <img
                              src={ovulationWhite}
                              alt="ovulation"
                              className="h-12 w-12 xxsm:h-14 xxsm:w-14"
                            />
                          ) : dayData.eventName === "PERIOD" ? (
                            <img
                              src={periodWhite}
                              alt="period"
                              className="h-14 w-14 xxsm:h-16 xxsm:w-16"
                            />
                          ) : dayData.eventName === "EXPECT OVULATION" ? (
                            <img
                              src={ovulationWhite}
                              alt="ovulation range"
                              className="h-12 w-12 xxsm:h-14 xxsm:w-14"
                            />
                          ) : dayData.eventName === "FERTILE WINDOW" ? (
                            <img
                              src={unsafeWhite}
                              alt="fertile window"
                              className="h-12 w-12 xxsm:h-14 xxsm:w-14"
                            />
                          ) : (
                            <img
                              src={calendarWhite}
                              alt="ovulation"
                              className="h-12 w-12 xxsm:h-14 xxsm:w-14"
                            />
                          )
                        ) : dayData.eventName === "OVULATION DATE" ? (
                          <img
                            src={ovulationGreen}
                            alt="ovulation"
                            className="h-12 w-12 xxsm:h-14 xxsm:w-14"
                          />
                        ) : dayData.eventName === "PERIOD" ? (
                          <img
                            src={period}
                            alt="period"
                            className="h-14 w-14 xxsm:h-16 xxsm:w-16"
                          />
                        ) : dayData.eventName === "EXPECT OVULATION" ? (
                          <img
                            src={ovulation}
                            alt="ovulation range"
                            className="w-12 h-12 xxsm:h-14 xxsm:w-14"
                          />
                        ) : dayData.eventName === "FERTILE WINDOW" ? (
                          <img
                            src={unsafe}
                            alt="fertile window"
                            className="w-12 h-12 xxsm:h-14 xxsm:w-14"
                          />
                        ) : (
                          <img
                            src={calendar}
                            alt="next date"
                            className="h-12 w-12 xxsm:h-14 xxsm:w-14"
                          />
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div
                  key={index}
                  ref={dayData.isToday ? todayRef : null}
                  className={`flex flex-col gap-2 h-24 w-full shadow-md px-2 py-3 rounded-md ${
                    dayData.isToday ? "bg-primary text-white font-bold" : ""
                  }`}
                >
                  <section className="flex flex-nowrap gap-4 text-sm">
                    <h4>
                      {monthShort} {dayData.day}
                    </h4>
                    <p className="text-sm">{dayData.dayOfWeek}</p>
                  </section>
                  <p className="text-sm">No Events</p>
                </div>
              ))
          )}
        </div>
        {/* Tablet and Desktop */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 text-sm md:text-base">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
          {renderDays()}
          {/* Legend */}
          <div className="flex justify-center mt-4 mb-2">
            <div className="flex flex-wrap justify-center gap-4 text-xs xl:text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 xl:h-4 xl:w-4 bg-red-100 border border-red-400 rounded"></div>
                <span>Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 xl:h-4 xl:w-4 bg-[#0af52c] bg-opacity-25 border border-green-400 rounded"></div>
                <span>Ovulation Date</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 xl:h-4 xl:w-4 bg-[#efff00] bg-opacity-25 border border-yellow-400 rounded"></div>
                <span>Expect Ovulation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 xl:h-4 xl:w-4 bg-[#10ccf2] bg-opacity-25 border border-red-400 rounded"></div>
                <span>Fertile Window</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;
