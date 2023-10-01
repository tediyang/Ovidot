import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './calendar.css';

const App = () => {
  const [events, setEvents] = useState([]);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const menstrualEndDate = new Date(startDate);
    menstrualEndDate.setDate(menstrualEndDate.getDate() + 5);

    const follicularEndDate = new Date(startDate);
    follicularEndDate.setDate(follicularEndDate.getDate() + 14);

    const ovulationDate = new Date(follicularEndDate);
    ovulationDate.setDate(ovulationDate.getDate() + 1);

    const lutealEndDate = new Date(ovulationDate);
    lutealEndDate.setDate(lutealEndDate.getDate() + 14);

    const nextPeriodStartDate = new Date(lutealEndDate);
    nextPeriodStartDate.setDate(nextPeriodStartDate.getDate() + 1);

    // Calculate next cycle phases
    const nextMenstrualEndDate = new Date(nextPeriodStartDate);
    nextMenstrualEndDate.setDate(nextMenstrualEndDate.getDate() + 5);

    const nextFollicularEndDate = new Date(nextPeriodStartDate);
    nextFollicularEndDate.setDate(nextFollicularEndDate.getDate() + 14);

    const nextOvulationDate = new Date(nextFollicularEndDate);
    nextOvulationDate.setDate(nextOvulationDate.getDate() + 1);

    const nextLutealEndDate = new Date(nextOvulationDate);
    nextLutealEndDate.setDate(nextLutealEndDate.getDate() + 14);

    setEvents([
      { title: 'Menstrual Phase', start: startDate.toISOString().split('T')[0], end: menstrualEndDate.toISOString().split('T')[0], color: 'red' },
      { title: 'Follicular Phase', start: menstrualEndDate.toISOString().split('T')[0], end: follicularEndDate.toISOString().split('T')[0], color: 'blue' },
      { title: 'Ovulation Phase', start: follicularEndDate.toISOString().split('T')[0], end: ovulationDate.toISOString().split('T')[0], color: 'green' },
      { title: 'Luteal Phase', start: ovulationDate.toISOString().split('T')[0], end: lutealEndDate.toISOString().split('T')[0], color: 'purple' },
      { title: 'Next Period', start: nextPeriodStartDate.toISOString().split('T')[0], end: nextMenstrualEndDate.toISOString().split('T')[0], color: 'hotpink' },
      { title: 'Next Follicular Phase', start: nextMenstrualEndDate.toISOString().split('T')[0], end: nextFollicularEndDate.toISOString().split('T')[0], color: 'blue' },
      { title: 'Next Ovulation Phase', start: nextFollicularEndDate.toISOString().split('T')[0], end: nextOvulationDate.toISOString().split('T')[0], color: 'green' },
      { title: 'Next Luteal Phase', start: nextOvulationDate.toISOString().split('T')[0], end: nextLutealEndDate.toISOString().split('T')[0], color: 'purple' }
    ]);
  }

  return (
    <div className="app">
      <h1>Cycle Tracker</h1>
      <input type="date" placeholder="Start Date" onChange={handleStartDateChange} />
      <button className='calendar-btn' onClick={handleStartDateChange}>My Days</button>
      <div className="calendar-container">
        <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        />
      </div>
      
    </div>
  );
}

export default App;
