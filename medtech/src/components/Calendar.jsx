import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import $ from 'jquery';
import { unserialize } from 'serialize-php';
import moment from 'moment';
const Calendar = () => {
  const IsLogged = localStorage.getItem("Islogged");
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const patient_email = localStorage.getItem('email');
  const [doctorInfo, setDoctorInfo] = useState(null);
  // const doctorinfo = localStorage.getItem('doctorinfo');
  const [customEvents, setCustomEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [appointmentReserved, setAppointmentReserved] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [reservedDateTime, setReservedDateTime] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  let doctorinfo = localStorage.getItem("doctorinfo");
  useEffect(() => {
    if (IsLogged !== "true") {
      setShowLoginMessage(true);
  } 
    const usertype = localStorage.getItem("user");
    let doctorId = null;
    let url = '';
  
    if (usertype === "Doctor") {
      const Drname = localStorage.getItem("userData");
      doctorId = localStorage.getItem("dr_id_pure"); 
      url = 'http://localhost:8000/getDoctorschedule.php';
    } else {
      const parsedDoctorInfo = doctorinfo ? JSON.parse(doctorinfo) : null;
      console.log(localStorage.doctorinfo);
      console.log(parsedDoctorInfo.id)
      doctorId = parsedDoctorInfo.id;
      
      url = 'http://localhost:8000/getDoctorInfo.php';
    }
  
    console.log(doctorId);
  
    if (doctorId) {
      fetchDoctorInfo(doctorId);
    }
  }, [doctorinfo]);
  

  
  const fetchDoctorInfo = async (doctorId) => {
    try {
      let url = '';
      const usertype = localStorage.getItem("user");
      if (usertype === "Doctor") {
        url = 'http://localhost:8000/getDoctorschedule.php';
        doctorId = doctorId.replace(/"/g, '');
      } else {
        url = 'http://localhost:8000/getDoctorInfo.php';
      }
      const response = await $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        data: { id: doctorId },
      });
  
      console.log('Response:', response); 
  
      setDoctorInfo(response);
  
      if (response && response.times) {
        const timesArray = unserialize(response.times); 
        const takenTimes = await taken_time(doctorId);
        const events = generateCustomEvents(timesArray, doctorId, takenTimes);
        setCustomEvents(events);
      } else {
        console.error('Doctor schedule information is missing.');
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    }
  };
  const generateCustomEvents = (timesArray, doctorId, takenTimes) => {
    let events = [];
    const currentDate = moment();
  
    for (let i = -3; i < 10; i++) {
      const startDate = moment(currentDate).startOf('week').add(i, 'weeks');
      const endDate = moment(startDate).endOf('week');
  
      timesArray.forEach((dayInfo) => {
        const { day, slots } = dayInfo;
        const dayOfWeek = moment().day(day);
  
        if (dayOfWeek <= endDate && dayOfWeek >= currentDate.day()) { // Check if the day is within the current week and after the current day
          const startOfWeek = moment(startDate).day(day).startOf('day');
  
          slots.forEach((slot) => {
            const startTime = moment(slot.starting_time, 'HH:mm');
            const endTime = moment(slot.ending_time, 'HH:mm');
  
            let currentStartTime = startTime.clone();
            while (currentStartTime.isBefore(endTime)) {
              const nextEndTime = moment.min(currentStartTime.clone().add(30, 'minutes'), endTime);
              const slotStart = startOfWeek.clone().add(currentStartTime.hours(), 'hours').add(currentStartTime.minutes(), 'minutes');
              const slotEnd = startOfWeek.clone().add(nextEndTime.hours(), 'hours').add(nextEndTime.minutes(), 'minutes');
  
              const isTaken = takenTimes.some((takenTime) => {
                return moment(takenTime.start).isSame(slotStart) && moment(takenTime.end).isSame(slotEnd);
              });
  
              const backgroundColor = isTaken ? 'yellow' : 'lightgray';
              let selectable = true; // Default to true
  
              // If the slot is in the current day
              if (slotStart.isSame(currentDate, 'day')) {
                selectable = false; // Make the slot unselectable
              }
  
              events.push({
                title: isTaken ? 'Taken' : 'Available',
                start: slotStart.format(),
                end: slotEnd.format(),
                backgroundColor: backgroundColor,
                borderColor: 'transparent',
                selectable: selectable && !isTaken
              });
  
              currentStartTime.add(30, 'minutes');
            }
          });
        }
      });
    }
  
    return events;
  };
  
  

  const taken_time = async (doctorId, date, start_time, end_time) => {
    try {
      const response = await $.ajax({
        url: 'http://localhost:8000/taken_time.php',
        type: 'GET',
        dataType: 'json',
        data: { doctorId, date, start_time, end_time },
      });

      return response;
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return [];
    }
  };
  const navigate = useNavigate();
  const location = useLocation(); 
  const handleEventClick = (clickInfo) => {
    const selectedDateTime = {
      start: clickInfo.event.start,
      end: clickInfo.event.end,
    };
    setSelectedDateTime(selectedDateTime);
  
    const usertype = localStorage.getItem("user"); 
    if (usertype === "Doctor") {
      if(clickInfo.event.backgroundColor === 'yellow'){
        navigate('/patient-info', { state: { selectedDateTime: selectedDateTime } });
      } else {
        setSelectedEvent(null);
      }
    } else {
      if (moment(clickInfo.event.start).isSameOrAfter(moment(), 'day')) { // Check if the slot is after or on the current day
        // Slot is for a future date
        if (clickInfo.event.backgroundColor === 'lightgray') {
          setSelectedEvent(clickInfo.event);
          clickInfo.event.setProp('title', 'Reserve');
          clickInfo.event.setProp('backgroundColor', 'red');
          setAppointmentReserved(true);
          setReservedDateTime(moment(clickInfo.event.start).format('YYYY-MM-DD HH:mm:ss'));
        } else {
          setSelectedEvent(null);
          clickInfo.event.setProp('title', 'Available');
          clickInfo.event.setProp('backgroundColor', 'lightgray');
        }
      } else {
        // Slot is for the current day
        // You may display a message or take any other action here
        console.log('You cannot reserve a time slot for the current day.');
      }
    }
  };
  

  const handlereserve = () => {
    if (!selectedEvent) {
      return;
    }
    
    if (selectedEvent.backgroundColor === 'lightgray') {
      console.error('Error: Cannot reserve appointment. Please select an available time slot.');
      return;
    }

    const appointmentData = {
      patient_email: patient_email,
      dr_id: doctorInfo.id,
      date: moment(selectedEvent.start).format('YYYY-MM-DD'),
      start_time: moment(selectedEvent.start).format('HH:mm:ss'),
      end_time: moment(selectedEvent.end).format('HH:mm:ss')
};
    $.ajax({
      url: 'http://localhost:8000/appointment.php',
      type: 'POST',
      dataType: 'json',
      data: appointmentData,
      success: function(response) {
        console.log('Appointment reserved successfully:', response);
        setPopupVisible(true);
        setAppointmentReserved(true);
        setReservedDateTime(moment(appointmentData.date + ' ' + appointmentData.start_time).format('YYYY-MM-DD HH:mm:ss'));
        setPopupVisible(true);

      },
      error: function(error) {
        console.error('Error reserving appointment:', error);
      }
    });
};

const handleClosePopup = () => {
setPopupVisible(false);
window.location.href = '/my-profile'; 
};

return (
<div className='Calendar'>
{doctorInfo && (
      <div>
        <h2>Doctor Information</h2>
        <p>Name: {doctorInfo.full_name}</p>
        <button onClick={() => window.location.href = `tel:${doctorInfo.phone}`}>Call Now</button>
        { showLoginMessage == false && localStorage.getItem("user") !== "Doctor" && !popupVisible && selectedEvent && (
          <button onClick={handlereserve}>Reserve</button>
        )}
        {showLoginMessage && (
            <p style={{ color: 'red' }}>Please login to reserve an appointment</p>
        )}
      </div>
    )}


  {/* Popup message */}
  {popupVisible && (
    <div className="popup">
      <div className="popup-content">
        <h2>Appointment Reserved Successfully</h2>
        <p>Your appointment is on {moment(reservedDateTime).format('MMMM Do YYYY, h:mm:ss a')}</p>
        <button onClick={handleClosePopup}>OK</button>
      </div>
    </div>
  )}
  {popupVisible && <div className='popup_overlay'></div> }

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
    events={customEvents}
    selectable={false}
    eventClick={handleEventClick}
    selectMirror={true}
    dayMaxEvents={true}
  />
</div>

);
};

export default Calendar; 