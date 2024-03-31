import React from "react";

const ExpertDerm = ({ name, image, isappointment, doctor, navigateToCalendar }) => {
  const appointment = (doctor) => {
    console.log('Selected Doctor:', doctor);
    console.log('Make appointment for doctor with ID:', doctor.id);
    const doctorInfo = {
      id: doctor.id,
      full_name: doctor.full_name,
      date_available: doctor.date_available,
      times: doctor.times
    };
    // Update local storage
    // localStorage.setItem('doctorinfo', JSON.stringify(doctor));
    localStorage.setItem('doctorinfo', JSON.stringify(doctorInfo));
  console.log('Updated localStorage:', localStorage.getItem('doctorinfo'));
    // Update state or perform other actions as needed
    navigateToCalendar(doctor.id);
  };
  
  const { id, full_name, times, date_available } = doctor;

  return (
    <div className="Expert-container">
      <div className="derm-background"></div>
      <div className="dr-img-container">
        <img src={image} alt={name} />
        <div className="dr-name-container">
          <p>{name}</p>
        </div>
        {isappointment ? (
          <button className="callnow-appointment" onClick={() => appointment(doctor)}>
            Make appointment &nbsp; &gt;
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ExpertDerm;
