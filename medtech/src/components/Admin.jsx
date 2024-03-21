import React, { useState, useEffect } from "react";
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
                console.log("Fetched data:", response);
                setData(response);
            },
            error: (xhr, status, error) => {
                console.error("Error fetching data:", status, error);
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
        setFormData(prevState => {
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
        console.log("Form Data:", formData);
        if (Object.values(formData).some(value => value === "")) {
            setErrorMessage("All fields should be filled");
            return;
        }
        // Check if the full name already exists
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
        console.log("setFormData"+setFormData);
        
        // Show the AddForm component
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

    };
   
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase().trim());
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
    const filteredDoctors = data.filter((doctor) =>
        doctor.full_name.toLowerCase().startsWith(searchQuery) &&
        doctor.phone_nb.includes(phoneFilter) &&
        (daysFilter.length === 0 || daysFilter.some((day) => doctor.date_available.includes(day)))
    );

    // const filteredDoctors = data.filter(doctor =>
    //     doctor.full_name.toLowerCase().startsWith(searchQuery)
    // );
    

    return (
        <div className="admin-container">
            <div>
                <div>

                 {!showAddForm && (
                    
                        <button onClick={toggleAddForm}>Add Doctor</button>
                    )}
                    {showAddForm && (

                        <div className="add-form-popup">
                        {editMode ? (
                            <button type="button" onClick={handleCancel}>Cancel</button>
                            ) :
                                <button onClick={toggleAddForm}>Close</button>
                            }
                        <h2>{editMode ? "Edit Doctor" : "Add Doctor"}</h2>
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
                                setShowAddForm = {setShowAddForm}
                                // updateDoctor={updateDoctor}
                                errorMessage={errorMessage}
                                setErrorMessage={setErrorMessage}
                            />
                    </div>
                    )}
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <input
                    type="text"
                    placeholder="Filter by phone number"
                    value={phoneFilter}
                    onChange={handlePhoneFilterChange}
                />
                <button onClick={toggleDaysFilter}>
                        {showDaysFilter ? "Hide Days Filter" : "Filter by Day"}
                    </button>
                    {showDaysFilter && (
                <div >
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
