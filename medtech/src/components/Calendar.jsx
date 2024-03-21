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

  // Modify the extractTimeSlots function to include starting and ending times
  const extractTimeSlots = (infoString) => {
    try {
      const deserializedTimes = deserializePhpArray(infoString);
      const { slots } = deserializedTimes;
      console.log(deserializedTimes);
      console.log(infoString);
      console.log(slots);
      console.log(Array.isArray(slots));

      if (slots && Array.isArray(slots)) {
        const timeSlots = [];
        slots.forEach(slot => {
          const { starting_time, ending_time } = slot;
          const startHour = parseInt(starting_time.split(':')[0]);
          const startMinute = parseInt(starting_time.split(':')[1]);
          const endHour = parseInt(ending_time.split(':')[0]);
          const endMinute = parseInt(ending_time.split(':')[1]);

          // Construct the event object for the original slot
          const originalEvent = {
            title: `Reserved (${starting_time} - ${ending_time})`,
            start: new Date().setHours(startHour, startMinute, 0, 0),
            end: new Date().setHours(endHour, endMinute, 0, 0),
            backgroundColor: 'darkred',
          };

          // Add original slot to the timeSlots array
          timeSlots.push(originalEvent);

          // Check if the slot falls within the calendar's visible time range
          if (startHour >= 8 && endHour <= 18) {
            // Loop through the slot's duration in 30-minute intervals
            for (let hour = startHour; hour < endHour; hour++) {
              for (let minute = 0; minute < 60; minute += 30) {
                // Calculate the end time for each 30-minute slot
                const slotEndHour = hour + Math.floor((minute + 30) / 60);
                const slotEndMinute = (minute + 30) % 60;

                // Construct the event object for the 30-minute slot
                const slotEvent = {
                  title: 'Reserved (30 mins)',
                  start: new Date().setHours(hour, minute, 0, 0),
                  end: new Date().setHours(slotEndHour, slotEndMinute, 0, 0),
                  backgroundColor: 'darkblue',
                };
                console.log(timeSlots);

                // Add 30-minute slot to the timeSlots array
                timeSlots.push(slotEvent);
              }
            }
          }
        });

        return timeSlots;
      } else {
        // console.log(timeSlots);
        console.log('No slots found in the schedule.');
        return [];
      }
    } catch (error) {
      console.error('Error extracting time slots:', error);
      return [];
    }
  };

  // Function to deserialize PHP serialized array
  const deserializePhpArray = (serializedArray) => {
    const regex = /s:(\d+):"([^"]+)";/g;
    let match;
    const result = {};

    while ((match = regex.exec(serializedArray)) !== null) {
      const [, length, value] = match;
      const key = match[match.length - 1]; // Extract the last matched value as the key
      result[key] = value;
    }

    return result;
  };

  // Fetch doctor information
  useEffect(() => {
    const fetchDoctorInfo = async (doctorId) => {
      try {
        const response = await $.ajax({
          url: 'http://localhost:8000/getDoctorInfo.php',
          type: 'GET',
          dataType: 'json',
          data: { id: doctorId },
        });

        console.log('Doctor Info:', response);
        setDoctorInfo(response);

        // Extract time slots from the response and update state
        const timeSlots = extractTimeSlots(response.times);
        setAppointments(timeSlots);
      } catch (error) {
        console.error('Error fetching doctor info:', error);
      }
    };

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
