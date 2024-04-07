import React, { useState, useEffect, useMemo } from "react";
import $ from "jquery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddForm from "./AddForm";
import TableDoctor from "./TableDoctor";
import ImageUploader from "./ImageUploader"; 

const Admin = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        full_name: "",
        image: "",
        date_available: [],
        time: [],
        phone_nb: "",
        starting_date: new Date()
    });
    
    const [formMode, setFormMode] = useState('add');
    const [errorMessage, setErrorMessage] = useState("");
    const [editedDoctor, setEditedDoctor] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [phoneFilter, setPhoneFilter] = useState("");
    const [daysFilter, setDaysFilter] = useState([]);
    const [showDaysFilter, setShowDaysFilter] = useState(false); 
    const [changetime , setchangetime] = useState(false);
    const [removetime , setremovetime] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };
    const fetchData = () => {
        $.ajax({
            url: "http://localhost:8000/getDoctors.php",
            type: "GET",
            dataType: "json",
            success: (response) => {
                setData(response);
            },
            error: (xhr, status, error) => {
            }
        });
    };

    const deleteDoctor = (full_name) => {
        $.ajax({
            url: "http://localhost:8000/deleteDoctor.php",
            type: "POST",
            data: { full_name },
            success: (response) => {
                console.log("Response from server:", response);
                fetchData();
            },
            error: (error) => {
                console.error("Error deleting doctor:", error);
            }
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
    
        if (type === 'file') {

            setFormData(prevState => ({
                ...prevState,
                [name]: e.target.files[0]
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }
    
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        console.log("Checkbox Change Event:", name, checked);
        console.log("Previous Date Available:", formData.date_available); // Log previous state
        
        setFormData(prevState => {
            if (checked) {
                return {
                    ...prevState,
                    date_available: [...prevState.date_available, name.trim()]
                };
            } else {
                return {
                    ...prevState,
                    date_available: prevState.date_available.filter(day => day.trim() !== name.trim())
                };
            }
        }, () => {
            console.log("Updated Date Available:", formData.date_available); // Log updated state
        });
    };
    const handleCheckboxChangeedit = (e) => {
        const { name, checked } = e.target;
        setEditedDoctor(prevState => {
            if (checked) {
                return {
                    ...prevState,
                    date_available: [...prevState.date_available, name]
                };
            } else {
                return {
                    ...prevState,
                    date_available: prevState.date_available.filter(day => day !== name)
                };
            }
        });
    };

    const addDoctor = (event) => {
        event.preventDefault();
        console.log("formData.time.day" , formData.day)
        console.log("formData.time.length" , formData.time.length)

        if (formData.time.length === 0) {
            const day = formData.date_available.find(day => formData.time.every(time => time.day !== day));
    
            if (!day) {
                setErrorMessage("Please select a day for the time slots.");
                return;
            }
    
            formData.time.push({
                day: day, 
                slots: [{
                    starting_time: '08:00', 
                    ending_time: '17:00'   
                }]
            });
        }
        
        if (Object.values(formData).some(value => value === "")) {
            setErrorMessage("All fields should be filled");
            return;
        }
        const fullNameExists = data.some(doctor => doctor.full_name === formData.full_name);
        if (fullNameExists) {
            setErrorMessage("Name already exists");
            return; 
        }
        
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        $.ajax({
            url: "http://localhost:8000/addDoctor.php",
            type: "POST",
            data: formDataToSend,
            contentType: false,
            processData: false,
            success: (response) => {
                console.log("Doctor added successfully", response );
                fetchData();
                setFormData({
                    full_name: "",
                    image: "",
                    date_available: [],
                    time: [],
                    phone_nb: "",
                    
                    starting_date: new Date()
                });
                setErrorMessage("");
            },
            error: (error) => {
                console.error("Error adding doctor:", error);
            }
        });
    };

    const [editMode, setEditMode] = useState(false);

    const editDoctor = (doctorId) => {
        setchangetime(false);
        setremovetime(false);

        const doctorToEdit = data.find(doctor => doctor.id === doctorId);
        console.log("Doctor to edit:", doctorToEdit); 
        console.log("Edited doctor:", editedDoctor); 

        const dateAvailableArray = doctorToEdit.date_available.split(',');
        const slotsArray = doctorToEdit.times.map(daySlot => ({
            day: daySlot.day,
            slots: daySlot.slots.map(slot => ({...slot})) 
        }));
        console.log("time slots", slotsArray);
        const timeArray = doctorToEdit.times ? doctorToEdit.times : [];

        setFormData({
            
            id: doctorToEdit.id,
            full_name: doctorToEdit.full_name,
            image: doctorToEdit.image,
            date_available: dateAvailableArray,
            time: slotsArray, 
            phone_nb: doctorToEdit.phone_nb,
            starting_date: doctorToEdit.starting_date
        });
        
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setEditMode(true);
    };
    
    const handleCancel = () => {
        handleInputChange({ target: { name: 'full_name', value: '' } });
        handleInputChange({ target: { name: 'image', value: '' } });
        handleInputChange({ target: { name: 'date_available', value: [] } });
        handleInputChange({ target: { name: 'time', value: [] } });
        handleInputChange({ target: { name: 'phone_nb', value: '' } });
        handleInputChange({ target: { name: 'starting_date', value: new Date() } });

        setShowAddForm(false);
        setEditMode(false);
        setremovetime(false);


    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setEditedDoctor(prevState => ({
                ...prevState,
                image: file
            }));
        } else {
        }
    };

    const cancelEdit = () => {
        setEditedDoctor(null);
        setEditMode(false);
        setShowAddForm(false);
        setremovetime(false);


    };
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handlePhoneFilterChange = (e) => {
        setPhoneFilter(e.target.value);
    };

    const handleDaysFilterChange = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            setDaysFilter((prevFilters) => [...prevFilters, name]);
        } else {
            setDaysFilter((prevFilters) => prevFilters.filter((day) => day !== name));
        }
    };
    
    const toggleDaysFilter = () => {
        setShowDaysFilter(!showDaysFilter);
    };
    // const filteredDoctors = data.filter((doctor) =>
    //     doctor.full_name.toLowerCase().startsWith(searchQuery) &&
    //     doctor.phone_nb.includes(phoneFilter) &&
    //     (daysFilter.length === 0 || daysFilter.some((day) => doctor.date_available.includes(day)))
    // );
    const filteredDoctors = useMemo(() => {
        return data.filter((doctor) =>
            doctor.full_name.toLowerCase().startsWith(searchQuery) &&
            doctor.phone_nb.includes(phoneFilter) &&
            (daysFilter.length === 0 || daysFilter.some((day) => doctor.date_available.includes(day)))
        );
    }, [data, searchQuery, phoneFilter, daysFilter]);
    const updateDoctor = (event) => {
        event.preventDefault();
        let formDataToSend = new FormData();
        const fullNameExists = data
            .filter(doctor => doctor.id !== formData.id)
            .some(doctor => doctor.full_name === formData.full_name);
        
        if (fullNameExists) {
            setErrorMessage("Name already exists");
            return; 
        }
    
        if (removetime) {
            // Update the time state before sending it to the server
            const updatedTimeSlots = formData.time.map(daySlot => ({
                day: daySlot.day.trim(),
                slots: daySlot.slots.map(slot => ({
                    starting_time: slot.starting_time,
                    ending_time: slot.ending_time
                }))
            }));
            const timeData = JSON.stringify(updatedTimeSlots);
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            formDataToSend.append('image', formData.image);
            formDataToSend.append('time', timeData);
        } else {
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            formDataToSend.append('image', formData.image);
            formDataToSend.append('changetime', changetime.toString());
        }
    
        $.ajax({
            url: "http://localhost:8000/editDoctor.php",
            type: "POST",
            data: formDataToSend,
            contentType: false,
            processData: false,
            success: (response) => {
                setFormData({
                    full_name: "",
                    image: "",
                    date_available: [],
                    time: [],
                    phone_nb: "",
                    starting_date: new Date()
                });
    
                fetchData();
                setErrorMessage("");
                setEditMode(false);
                setShowAddForm(false);
                setremovetime(false); 
            },
            error: (error) => {
                setErrorMessage("Error updating doctor: " + error.message);
            }
        });
    };
    
    

    return (
        <div className="admin-container">
            <div>
                <div className="table-title-class">
                <div className="table-title-class-child">
                    <input
                        className="search-bar"
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    <input
                        className="search-bar"
                    type="text"
                    placeholder="Filter by phone number"
                    value={phoneFilter}
                        onChange={handlePhoneFilterChange}
                    />
                    <div className="admin-container-add-filter-button">
                        {!showAddForm && (
                            <button onClick={toggleAddForm}>Add Doctor</button>
                        )}
                        <button onClick={toggleDaysFilter}>
                            {showDaysFilter ? "Hide Days Filter" : "Filter by Day"}
                        </button>
                    </div>
                </div>
                {showAddForm && (
                <div className="add-form-popup">
                    <div className="h2-close-cancel-div">
                    <h2>{editMode ? "Edit Doctor" : "Add Doctor"}</h2>
                        {editMode ? (
                            <button type="button" onClick={handleCancel}>Cancel</button>
                            ) :
                                <button onClick={toggleAddForm}>Close</button>
                            }
                    </div>
                        <AddForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleCheckboxChange={handleCheckboxChange}
                            handleImageChange={handleImageChange}
                            editMode={editMode}
                            editedDoctor={editedDoctor}
                            setEditedDoctor={setEditedDoctor}
                            fetchData = {fetchData}
                            addDoctor={addDoctor}
                            setEditMode={setEditMode}
                            setFormData = {setFormData}
                            setShowAddForm = {setShowAddForm}
                            filteredDoctors = {filteredDoctors}
                            setchangetime = {setchangetime}
                            changetime = {changetime}
                            updateDoctor = {updateDoctor}
                            errorMessage={errorMessage}
                            setErrorMessage={setErrorMessage}
                        />
                </div>
                )}
                {showDaysFilter && (
                    <div className="days-list">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <label key={day} style={{ marginRight: '10px' }}>
                            <input
                                type="checkbox"
                                name={""+day}
                                checked={daysFilter.includes(day)}
                                    onChange={handleDaysFilterChange}
                            />
                            {day}
                        </label>
                    ))}
                </div>
                )}

                </div>
                <TableDoctor
                    data={filteredDoctors}
                    filteredDoctors = {filteredDoctors}
                    // editedDoctor={editedDoctor}
                    editDoctor={editDoctor}
                    setErrorMessage = {setErrorMessage}
                    deleteDoctor={deleteDoctor}
                    handleCheckboxChangeedit={handleCheckboxChangeedit}
                    handleImageChange={handleImageChange}
                    // updateDoctor={updateDoctor}
                    cancelEdit={cancelEdit}
                    editMode={editMode}
                />  


            </div>

        </div>
    );
};

export default Admin;