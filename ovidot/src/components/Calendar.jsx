import React from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timerGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


const Calendar = () => {
  return (
    <div>
    <Fullcalendar 
    plugins={[dayGridPlugin,timerGridPlugin,interactionPlugin]}
    initialview={"dayGridMonth"}
    headerToolbar={{
        start: '', // will normally be on the left. if RTL, will be on the right
        center: 'title',
        end: 'today prev,next' // will normally be on the right. if RTL, will be on the left
    }}
    height={'90vh'}
    //aspectRatio={'2'}
    />
    </div>
  )
}

export default Calendar