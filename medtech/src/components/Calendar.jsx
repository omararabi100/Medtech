import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import $ from 'jquery';

const Calendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const doctorinfo = localStorage.getItem('doctorinfo');
  const parsedDoctorInfo = doctorinfo ? JSON.parse(doctorinfo) : null;

  const doctorId = parsedDoctorInfo ? parsedDoctorInfo.id : null;

  const fetchDoctorInfo = (doctorId) => {
    $.ajax({
      url: `http://localhost:8000/getDoctorInfo.php`,
      type: 'GET',
      dataType: 'json',
      data: { id: doctorId },
      success: (response) => {
        console.log('Doctor Info:', response);
        setDoctorInfo(response);

        if (response && response.times && Array.isArray(response.times)) {
          const availableTimes = response.times.reduce((acc, dayInfo) => {
            if (dayInfo.slots && Array.isArray(dayInfo.slots)) {
              dayInfo.slots.forEach((slot) => {
                acc.push({
                  title: 'Available',
                  start: new Date().setHours(parseInt(slot.starting_time.split(':')[0]), parseInt(slot.starting_time.split(':')[1]), 0, 0),
                  end: new Date().setHours(parseInt(slot.ending_time.split(':')[0]), parseInt(slot.ending_time.split(':')[1]), 0, 0),
                });
              });
            }
            return acc;
          }, []);
          setAppointments(availableTimes);
        }
      },
      error: (xhr, status, error) => {
        console.error('Error fetching doctor info:', status, error);
      },
    });
  };

  useEffect(() => {
    if (doctorId) {
      fetchDoctorInfo(doctorId);
    }
  }, [doctorId]);

  return (
    <div>
      {doctorInfo && (
        <div>
          <h2>Doctor Information</h2>
          <p>Name: {doctorInfo.full_name}</p>
          <button onClick={() => window.location.href = `tel:${doctorInfo.phone}`}>Call Now</button>
          <button onClick={() => console.log('Reserved')}>Reserve</button>
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        slotDuration="00:30:00"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={appointments}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
      />
    </div>
  );
};

export default Calendar;
