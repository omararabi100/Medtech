import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import $ from 'jquery'; 

const PatientInfo = () => {
    const location = useLocation();
    const selectedDateTime = location.state.selectedDateTime;
    const [patientData, setPatientData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [diagnosisText, setDiagnosisText] = useState('');
    const [diagnosisError, setDiagnosisError] = useState('');
    const [drId, setDrId] = useState(localStorage.getItem("dr_id")); // Retrieve dr_id from localStorage
    const [diagnosisUpdated, setDiagnosisUpdated] = useState(false);

    const startTime = moment(selectedDateTime.start).format(' h:mm:ss a');
    const endTime = moment(selectedDateTime.end).format(' h:mm:ss a');

    useEffect(() => {
        const fetchPatientData = async () => {
            setLoading(true);
            try {
                const formattedDate = moment(selectedDateTime.start).format('YYYY-MM-DD');
                const formattedStartTime = moment(selectedDateTime.start).format('HH:mm:ss');
                const formattedEndTime = moment(selectedDateTime.end).format('HH:mm:ss');
                let doctorId = localStorage.getItem("dr_id"); 
                doctorId = doctorId.replace(/"/g, ''); 

                const response = await $.ajax({
                    type: "POST",
                    url: "http://localhost:8000/getpatientinfo.php",
                    data: { 
                        doctorId: doctorId, 
                        formattedDate: formattedDate,
                        formattedStartTime: formattedStartTime,
                        formattedEndTime: formattedEndTime 
                    },
                });

                setPatientData(response);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [selectedDateTime, drId, diagnosisUpdated]); 

    const calculateAge = (dob) => {
        const age = moment().diff(dob, 'years');
        return age;
    };

    const handleDiagnosisChange = (event) => {
        setDiagnosisText(event.target.value);
        setDiagnosisError(''); 
    };

    const handleUpdateDiagnosis = () => {
        if (!diagnosisText.trim()) {
            setDiagnosisError('Diagnosis is not filled');
            return;
        }
        let doctorId = localStorage.getItem("dr_id"); 
        doctorId = doctorId.replace(/"/g, ''); 
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/updateDiagnosis.php",
            data: {
                doctorId: doctorId, 
                patientId: patientData.patient_info.patient_id,
                diagnosis: diagnosisText
            },
            success: function(response) {
                setDiagnosisUpdated(!diagnosisUpdated); // Trigger fetchPatientData to get updated data
                setDiagnosisText(''); // Clear the diagnosis text
            },
            error: function(error) {
                console.error('Error updating diagnosis:', error);
            }
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <h1>Patient Information</h1>
            <p>Start Time: {startTime}</p>
            <p>End Time: {endTime}</p>
            {patientData && (
                <>
                    <p>Patient ID: {patientData.patient_info.patient_id}</p>
                    <p>Patient Name: {patientData.patient_info.full_name}</p>
                    <p>Patient Gender: {patientData.patient_info.gender}</p>
                    <p>Patient Age: {calculateAge(patientData.patient_info.dateofbirth)}</p>

                    {patientData.patient_info.history ? (
                        <p>History: {patientData.patient_info.history}</p>
                    ) : (
                        <p>History: No past history</p>
                    )}

                    {patientData.patient_info.allergies ? (
                        <p>Allergies: {patientData.patient_info.allergies}</p>
                    ) : (
                        <p>Allergies: No allergies </p>
                    )}
                    <h2>Diagnosis</h2>
                    {patientData.diagnosis && patientData.diagnosis.map((diagnosis, index) => (
                        <div key={index}>
                            <p>Diagnosis: {diagnosis.diagnosis}</p>
                            <p>Date: {diagnosis.date}</p>
                            <p>Doctor name: {diagnosis.full_name}</p>
                            {diagnosis.doctor_id && (
                                <p>Doctor Name: {diagnosis.doctor_name}</p>
                            )}
                            {!diagnosis.doctor_id && (
                                <p>Doctor Name: Not available</p>
                            )}
                            
                            {diagnosis.image && (
                                <img src={`data:image/png;base64,${diagnosis.image}`} alt="Diagnosis" />
                            )}
                            <hr />
                        </div>
                    ))}
                    {diagnosisError && <p style={{ color: 'red' }}>{diagnosisError}</p>}
                    <textarea
                        name="diagnosis"
                        value={diagnosisText}
                        onChange={handleDiagnosisChange}
                        cols="35"
                        rows="4"
                    ></textarea>
                    <button onClick={handleUpdateDiagnosis}>Update</button>
                    <br />
                    {diagnosisUpdated && (
                        <span>Diagnosis updated successfully</span>
                    )}
                </>
            )}
        </>
    );
};

export default PatientInfo;
