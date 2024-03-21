import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from "./ImageUploader";

const AddForm = ({ formData, handleInputChange, handleCheckboxChange, addDoctor, errorMessage,setErrorMessage,setEditMode,setShowAddForm,editMode,editDoctor,editedDoctor,fetchData  }) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const [timeSlots, setTimeSlots] = useState([]);
    console.log("EditMode Value:", editMode); 

   const updateDoctor = async (event) => {
    event.preventDefault();
    console.log("Updated Doctor Data:", formData);

    try {
        const timeData = JSON.stringify(formData.time);

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === 'time') {
                formDataToSend.append(key, timeData); 
            } else {
                formDataToSend.append(key, formData[key]);
            }
            
        }

        const response = await fetch("http://localhost:8000/editDoctor.php", {
            method: "POST",
            body: formDataToSend,
        });
        if (errorMessage ==="Time slots are empty. Please fill them.") {
            setErrorMessage("Time slots are empty. Please fill them.");
            return;
        }
        if (!response.ok) {
            if (response.status === 500) {
                throw new Error("Internal Server Error");
            } else {
                throw new Error("HTTP Error: " + response.statusText);
            }
        }
        else {
            // Reset form data after successful update
            handleInputChange({ target: { name: 'full_name', value: '' } });
            handleInputChange({ target: { name: 'image', value: '' } });
            handleInputChange({ target: { name: 'date_available', value: [] } });
            handleInputChange({ target: { name: 'time', value: [] } });
            handleInputChange({ target: { name: 'phone_nb', value: '' } });
            handleInputChange({ target: { name: 'starting_date', value: new Date() } });
        }


        const data = await response.json();
        console.log("Response Data:", data); // Log response for debugging
        setShowAddForm(false);
        setEditMode(false);
        fetchData();


        // Handle successful response (if needed)
    } catch (error) {
        console.error("Error updating doctor:", error);
        setErrorMessage("Error updating doctor: " + error.message); // Set appropriate error message
    }
};


    useEffect(() => {
        console.log("Edit mode:", editMode); // Check if in edit mode
    console.log("Edited doctor:", editedDoctor); // Check the edited doctor object
    console.log("Time slots data:", formData.time); // Check the time slots data in formData

        if (editMode && editedDoctor) {
          // Populate form data with edited doctor's data
          setFormData({
            image: editedDoctor.image || formData.image, 
            full_name: editedDoctor.full_name ||formData.full_name,
            phone_nb: editedDoctor.phone_nb || formData.phone_nb,
            starting_date: editedDoctor.starting_date ||formData.starting_date ,
            date_available: editedDoctor.date_available || [],
            time: editedDoctor.time || formData.time,
          });
          
    
      
          // Update time slots based on edited doctor's data
          const initialTimeSlots = editedDoctor.date_available.map(day => ({
            day,
            slots: editedDoctor.time.find(item => item.day === day)?.slots || [{ starting_time: "", ending_time: "" }],
          }));
          setTimeSlots(initialTimeSlots);
        }
      }, [editMode, editedDoctor]);
      const handleTimeSlotChange = (dayIndex, slotIndex, fieldName, value) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[dayIndex].slots[slotIndex] = {
            ...newTimeSlots[dayIndex].slots[slotIndex],
            [fieldName]: value
        };
        
        setTimeSlots(newTimeSlots);
    
        // Update the formData with updated time slots
        const newFormData = { ...formData };
        newFormData.time = newTimeSlots.map(daySlot => ({
            day: daySlot.day,
            slots: daySlot.slots.map(slot => ({
                starting_time: slot.starting_time,
                ending_time: slot.ending_time
            }))
        }));
        handleInputChange({ target: { name: 'time', value: JSON.stringify(newFormData.time) } });

    };
    
    const addTimeSlot = (dayIndex) => {
        const newTimeSlots = [...timeSlots];
        const daySlots = newTimeSlots[dayIndex]?.slots || [];
        daySlots.push({ starting_time: '', ending_time: '' });
        newTimeSlots[dayIndex] = { day: formData.date_available[dayIndex], slots: daySlots };
        setTimeSlots(newTimeSlots);
    
        // Update the formData with updated time slots
        const newFormData = { ...formData };
        newFormData.time = newTimeSlots.map(daySlot => ({
            day: daySlot.day,
            slots: daySlot.slots.map(slot => ({
                starting_time: slot.starting_time,
                ending_time: slot.ending_time
            }))
        }));
        handleInputChange({ target: { name: 'time', value: JSON.stringify(newFormData.time) } });
    };
    
    //   last 
    // const handleTimeSlotChange = (dayIndex, slotIndex, fieldName, value) => {
    //     const newTimeSlots = [...timeSlots];
    //     newTimeSlots[dayIndex].slots[slotIndex] = {
    //         ...newTimeSlots[dayIndex].slots[slotIndex],
    //         [fieldName]: value
    //     };
    //     setTimeSlots(newTimeSlots);
    //     const newFormData = { ...formData };
    //     newFormData.time = newTimeSlots;
    //     // Serialize the time slots array as JSON
    //     const jsonTimeSlots = JSON.stringify(newTimeSlots);
    //     // Update the formData time array
    //     handleInputChange({ target: { name: 'time', value: jsonTimeSlots } });
    // };
    // const addTimeSlot = (dayIndex) => {
    //     const newTimeSlots = [...timeSlots];
    //     const daySlots = newTimeSlots[dayIndex]?.slots || []; // Access 'slots' or initialize as empty array
    //     daySlots.push({ starting_time: '', ending_time: '' });
    //     newTimeSlots[dayIndex] = { ...newTimeSlots[dayIndex], slots: daySlots }; // Update day's slots
    //     setTimeSlots(newTimeSlots);
    
    //     // Update the formData time array
    //     const newFormData = { ...formData };
    //     newFormData.time = newTimeSlots;
    //     const jsonTimeSlots = JSON.stringify(newTimeSlots);
    //     handleInputChange({ target: { name: 'time', value: jsonTimeSlots } });
    // };
    
    // const addTimeSlot = (dayIndex) => {
    //     const newTimeSlots = [...timeSlots];
    //     newTimeSlots[dayIndex].slots.push({ starting_time: '', ending_time: '' });
    //     setTimeSlots(newTimeSlots);
    //     // Update the formData time array
    //     const newFormData = { ...formData };
    //     newFormData.time = newTimeSlots;
    //     // Serialize the time slots array as JSON
    //     const jsonTimeSlots = JSON.stringify(newTimeSlots);
    //     // Update the formData time array
    //     handleInputChange({ target: { name: 'time', value: jsonTimeSlots } });
    // };

    return (
        <form className="addform">
            
            <div className="containers">
                
                <ImageUploader handleImageChange={handleInputChange} formData={formData} editMode = {editMode} />
                <label htmlFor="">Full name
                                
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                    
                    </label>
                <label htmlFor="">Phone number
                    <input type="tel" placeholder="Phone number" name="phone_nb" value={formData.phone_nb} onChange={handleInputChange} />
                </label>
                <label>Starting Date:
                    <input type="date" name="starting_date" value={formData.starting_date} onChange={handleInputChange} min={currentDate} />
                </label>
                <div>
                    {formData.date_available.map((day, dayIndex) => (
                        <div key={dayIndex}>
                            <div className="Addform-div">
                                <label>{day}</label>
                                <button type="button" onClick={() => addTimeSlot(dayIndex)}>Add Time Slot</button>
                            </div>
                            {timeSlots[dayIndex] && timeSlots[dayIndex].slots.map((slot, slotIndex) => (
                                <div key={slotIndex}>
                                    <label>Start Time:
                                        <input type="time" name="time" value={slot.starting_time} onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'starting_time', e.target.value)} />
                                    </label>
                                    <label>End Time:
                                        <input type="time" name="time" value={slot.ending_time} onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'ending_time', e.target.value)} />
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day}>
                        <input
                            type="checkbox"
                            name={day}
                            checked={formData.date_available.includes(day)}
                            onChange={handleCheckboxChange}
                        />
                        {day}
                    </label>
                ))}
            </div>
            {editMode ? ( // Conditionally render Update button when in edit mode
                <button type="button" onClick={updateDoctor}>Update</button>
            ) : (
                <button type="submit" onClick={addDoctor}>Add</button>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
};

export default AddForm;
