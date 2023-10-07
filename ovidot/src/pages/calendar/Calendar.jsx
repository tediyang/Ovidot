import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './calendar.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [menstrualLength, setMenstrualLength] = useState(5);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    if (startDate) {
      handleStartDateChange();
    }
  }, [startDate, menstrualLength]);

  const handleStartDateChange = () => {
    const menstrualEndDate = new Date(startDate);
    menstrualEndDate.setDate(menstrualEndDate.getDate() + menstrualLength);

    const follicularEndDate = new Date(menstrualEndDate);
    follicularEndDate.setDate(follicularEndDate.getDate() + ((28 - menstrualLength) * 0.5));

    const ovulationDate = new Date(follicularEndDate);
    ovulationDate.setDate(ovulationDate.getDate() + 1);

    const lutealEndDate = new Date(ovulationDate);
    lutealEndDate.setDate(lutealEndDate.getDate() + ((28 - menstrualLength) * 0.5));

    const nextPeriodStartDate = new Date(lutealEndDate);
    nextPeriodStartDate.setDate(nextPeriodStartDate.getDate() + 1);

    setEvents([
      { title: 'Menstrual Phase', start: startDate.toISOString().split('T')[0], end: menstrualEndDate.toISOString().split('T')[0], color: 'red' },
      { title: 'Follicular Phase', start: menstrualEndDate.toISOString().split('T')[0], end: follicularEndDate.toISOString().split('T')[0], color: 'blue' },
      { title: 'Ovulation Phase', start: follicularEndDate.toISOString().split('T')[0], end: ovulationDate.toISOString().split('T')[0], color: 'green' },
      { title: 'Luteal Phase', start: ovulationDate.toISOString().split('T')[0], end: lutealEndDate.toISOString().split('T')[0], color: 'purple' },
      { title: 'Next Period', start: nextPeriodStartDate.toISOString().split('T')[0], end: nextPeriodStartDate.toISOString().split('T')[0], color: 'hotpink' }
    ]);
  }

  const handleInputDateChange = (e) => {
    setStartDate(new Date(e.target.value));
  }

  const handleMenstrualLengthChange = (e) => {
    setMenstrualLength(e.target.value);
  }

  return (
    <div className="app">
      <h1>Cycle Tracker</h1>
      <input type="date" placeholder="Start Date" onChange={handleInputDateChange} />
      <button>Last Period (Starting Date)</button>
      <p></p>
      <select onChange={handleMenstrualLengthChange}>
        {[...Array(6)].map((_, i) => (
          <option key={i} value={i + 2}>{i + 2}</option>
        ))}
      </select>
      <button>Length of your Menstrual Phase</button>
      <p>Tip: If you don't know the length of your menstrual phase, please select 5. </p>
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
}

export default App;
