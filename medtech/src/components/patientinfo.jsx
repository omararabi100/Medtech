import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import moment from 'moment';
import $ from 'jquery'; 

const PatientInfo = () => {
    const location = useLocation();
    const { patient_id } = useParams();
    const [selectedDateTime, setSelectedDateTime] = useState(location.state?.selectedDateTime || { start: null, end: null }); 
    const [patientData, setPatientData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [diagnosisText, setDiagnosisText] = useState('');
    const [diagnosisError, setDiagnosisError] = useState('');
    // const [drId, setDrId] = useState(localStorage.getItem("dr_id")); // Retrieve dr_id from localStorage
    const [diagnosisUpdated, setDiagnosisUpdated] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Define startTime and endTime here
    const startTime = selectedDateTime ? moment(selectedDateTime.start).format(' h:mm:ss a') : null;
    const endTime = selectedDateTime ? moment(selectedDateTime.end).format(' h:mm:ss a') : null;
    // const storageData = JSON.parse(localStorage.getItem('doc'));
    const doctorInfo = JSON.parse(localStorage.doctorinfo);
    let drId = doctorInfo.id;
    useEffect(() => {
        const fetchPatientData = async () => {
            setLoading(true);
            try {
                let requestData = {};
                let doctorId = localStorage.getItem("dr_id"); 
                doctorId = doctorId.replace(/"/g, ''); 
                console.log(selectedDateTime)
                if (selectedDateTime.start !== null && selectedDateTime.end !== null) {
                    const formattedDate = moment(selectedDateTime.start).format('YYYY-MM-DD');
                    const formattedStartTime = moment(selectedDateTime.start).format('HH:mm:ss');
                    const formattedEndTime = moment(selectedDateTime.end).format('HH:mm:ss');
                    
                    requestData = { 
                        doctorId: doctorId, 
                        formattedDate: formattedDate,
                        formattedStartTime: formattedStartTime,
                        formattedEndTime: formattedEndTime ,
                    };
                } else {
                    requestData = { 
                        doctorId: null, 
                        formattedDate: null,
                        formattedStartTime: null,
                        formattedEndTime:null ,
                        patient_id: patient_id };
                }
    
                const response = await $.ajax({
                    type: "POST",
                    url: "http://localhost:8000/getpatientinfo.php",
                    data: requestData,
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
        // let doctorId = localStorage.getItem("dr_id"); 
        drId = drId.replace(/"/g, ''); 
        // console.log(localStorage.doctorinfo.id);
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/updateDiagnosis.php",
            data: {
                doctorId: drId, 
                patientId: patientData.patient_info.patient_id,
                diagnosis: diagnosisText
            },
            success: function(response) {
                setDiagnosisUpdated(!diagnosisUpdated); 
                setDiagnosisText(''); 
            },
            error: function(error) {
                console.error('Error updating diagnosis:', error);
            }
        });
    };

    const openModal = (image) => {
        setSelectedImage(image);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setModalOpen(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className='Patient-div'>

            <h1>Patient Information</h1>
            {selectedDateTime.start !== null && selectedDateTime.end !== null && (
                <div>
                    <p>Start Time: {startTime}</p>
                    <p>End Time: {endTime}</p>
                </div>
            )}
            {patientData && (
                <>
                <div className='patient-primary-data'>
                    <p> ID: {patientData.patient_info.patient_id}</p>
                    <p> Name: {patientData.patient_info.full_name}</p>
                    <p> Gender: {patientData.patient_info.gender}</p>
                    <p> Age: {calculateAge(patientData.patient_info.dateofbirth)}</p>
                    </div>
                    <div>
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
                    </div>
                    <h2>Diagnosis</h2>
                    {/* {patientData.diagnosis && patientData.diagnosis.map((diagnosis, index) => (
                        <div key={index} className='diagnosis'>
                            <div>

                            <p>Diagnosis: {diagnosis.diagnosis}</p>
                            <p>Date: {diagnosis.date}</p>
                            {diagnosis.dr_id ?(

                                <p>Doctor Name: {diagnosis.doctor_name}</p>
                            ) :
                            <></>
                            }
                            {diagnosis.image && (
                                <img
                                src={
                                `data:image/${diagnosis.image.endsWith('.jpg') || diagnosis.image.endsWith('.jpeg') ? 'jpeg' : 'png'};base64,${diagnosis.image}`
                                }
                                alt="diagnosis"
                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                onClick={() => openModal(diagnosis.image)}
                                />
                            )}
                            </div>

                        </div>
                    ))} */}
                    <div className='diagnosis_div_container'>

                    {patientData.diagnosis && patientData.diagnosis.map((diagnosis, index) => (
                    <div key={index} className="diagnosis_div">
                        <p>Diagnosis: {diagnosis.diagnosis}</p>
                        <p>Date: {diagnosis.date}</p>
                        {diagnosis.doctor_name && <p>Doctor: {diagnosis.doctor_name}</p>}
                        {diagnosis.image && (
                                <img
                                src={
                                `data:image/${diagnosis.image.endsWith('.jpg') || diagnosis.image.endsWith('.jpeg') ? 'jpeg' : 'png'};base64,${diagnosis.image}`
                                }
                                alt="diagnosis"
                                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                                onClick={() => openModal(diagnosis.image)}
                                />
                            )}                    </div>
                ))}
                    </div>
                    <h2>Add a diagnosis</h2>
                    {diagnosisError && <p style={{ color: 'red' }}>{diagnosisError}</p>}
                    <div className='add_diagnosis'>

                    <textarea
                        name="diagnosis"
                        value={diagnosisText}
                        onChange={handleDiagnosisChange}
                        cols="35"
                        rows="4"
                        ></textarea>
                    <button onClick={handleUpdateDiagnosis}>Update</button>
                        </div>
                    
                    <br />
                    {diagnosisUpdated && (
                        <span>Diagnosis updated successfully</span>
                    )}

                    {modalOpen && (
                        <div className="modal" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <span className="close" onClick={closeModal}>&times;</span>
                                <img
                                    src={`data:image/${selectedImage.endsWith('.jpg') || selectedImage.endsWith('.jpeg') ? 'jpeg' : 'png'};base64,${selectedImage}`}
                                    alt="diagnosis"
                                    style={{ maxWidth: '90%', maxHeight: '90%', margin: 'auto', display: 'block' }}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PatientInfo;
