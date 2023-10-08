import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './calendar.css'

const MenstrualCycleCalendar = () => {
  const [cycleStart, setCycleStart] = useState(null);
  const [menstrualPhaseLength, setMenstrualPhaseLength] = useState(null);
  const [events, setEvents] = useState([]);

  // Update events whenever cycleStart or menstrualPhaseLength changes
  useEffect(() => {
    if (cycleStart && menstrualPhaseLength) {
      const newEvents = calculateCycleEvents(cycleStart, menstrualPhaseLength);
      setEvents(newEvents);
    }
  }, [cycleStart, menstrualPhaseLength]);

  return (
    <div className="app">
      <h1>Cycle Tracker</h1>
      <input type="date" onChange={e => setCycleStart(e.target.value)} />
      <button>Last Period (Starting Date)</button>
      <p></p>
      <input type="number" min="2" max="7" onChange={e => setMenstrualPhaseLength(e.target.value)} />
      <button>Length of your Menstrual Phase</button>
      <p>Tip: If you don't know the length of your menstrual phase, please input 5. </p>
      <p></p>
      <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
      </div>
    </div>
  );
};

// This function calculates the events (phases of the menstrual cycle) based on the start date and phase length
function calculateCycleEvents(cycleStart, menstrualPhaseLength) {
  const cycleStartDate = new Date(cycleStart);
  const events = [];

  // Menstrual phase
  for (let i = 0; i < menstrualPhaseLength; i++) {
    const date = new Date(cycleStartDate);
    date.setDate(date.getDate() + i);
    events.push({ 
      title: i === 0 ? 'Menstrual Phase' : '', 
      date: date.toISOString().split('T')[0],
      color: 'red'
    });
  }

  // Follicular phase
  for (let i = 0; i < 7; i++) {
    const date = new Date(cycleStartDate);
    date.setDate(date.getDate() + Number(menstrualPhaseLength) + i);
    events.push({ 
      title: i === 0 ? 'Follicular Phase' : '', 
      date: date.toISOString().split('T')[0],
      color: 'blue'
    });
  }

  // Ovulation day
  const ovulationDate = new Date(cycleStartDate);
  ovulationDate.setDate(ovulationDate.getDate() + Number(menstrualPhaseLength) + 7);
  events.push({ 
    title: 'Ovulation', 
    date: ovulationDate.toISOString().split('T')[0],
    color: 'green'
   });

  // Luteal phase
  for (let i = 1; i <= 15; i++) {
    const date = new Date(ovulationDate);
    date.setDate(date.getDate() + i);
    events.push({ 
      title: i === 1 ? 'Luteal Phase' : '', 
      date: date.toISOString().split('T')[0],
      color: 'Purple'
     });
  }

   // Next period
   const nextPeriodDate = new Date(ovulationDate);
   nextPeriodDate.setDate(nextPeriodDate.getDate() + 16);
   events.push({ 
     title: 'Next Period', 
     date: nextPeriodDate.toISOString().split('T')[0],
     color: 'hotpink'
   });

   return events;
}

export default MenstrualCycleCalendar;
