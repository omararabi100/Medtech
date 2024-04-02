import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from "./ImageUploader";
import $ from "jquery";

const AddForm = ({ formData, handleInputChange, handleCheckboxChange, addDoctor, errorMessage,setErrorMessage,setEditMode,setShowAddForm,editMode,editDoctor,editedDoctor,fetchData , setFormData , changetime , setchangetime , updateDoctor }) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const [timeSlots, setTimeSlots] = useState([]);

useEffect(() => {
    if (editMode) {
        console.log("formData" , formData);
        let days = [];
        if (typeof formData.date_available === 'string') {
            days = formData.date_available.split(',').map(day => day.trim());
        } else if (Array.isArray(formData.date_available)) {
            days = formData.date_available;
        }

        const initialTimeSlots = formData.time.map(({ day, slots }) => ({
            day,
            slots: slots.map(({ starting_time, ending_time }) => ({ starting_time, ending_time })),
        }));
        console.log(initialTimeSlots);
        setTimeSlots(initialTimeSlots);
    }
}, [editMode, formData.date_available ]);

const handleTimeSlotChange = (dayIndex, slotIndex, fieldName, value) => {
    setchangetime(true);
    const newTimeSlots = [...timeSlots];
    const [hours, minutes] = value.split(":").map(Number);
    let roundedHours = hours;
    let roundedMinutes = minutes;
    
    if (minutes >= 53) {
        roundedHours++;
        roundedMinutes = 0;
    } else {
        roundedMinutes = Math.round(minutes / 15) * 15; 
    }

    if (roundedMinutes === 60) {
        roundedHours++;
        roundedMinutes = 0;
    }
    
    // Format the time
    const formattedTime = `${roundedHours.toString().padStart(2, "0")}:${roundedMinutes.toString().padStart(2, "0")}`;
    
    newTimeSlots[dayIndex].slots[slotIndex] = {
        ...newTimeSlots[dayIndex].slots[slotIndex],
        [fieldName]: formattedTime
    };

    setTimeSlots(newTimeSlots);

    const newFormData = { ...formData };
    newFormData.time = newTimeSlots.map(daySlot => ({
        day: daySlot.day.trim(),
        slots: daySlot.slots.map(slot => ({
            starting_time: slot.starting_time,
            ending_time: slot.ending_time
        }))
    }));
    setFormData(newFormData);
    handleInputChange({ target: { name: 'time', value: JSON.stringify(newFormData.time) } });
};


const addTimeSlot = (dayIndex) => {
    const newTimeSlots = [...timeSlots];
    const daySlots = newTimeSlots[dayIndex]?.slots || [];
    daySlots.push({ starting_time: '', ending_time: '' });
    newTimeSlots[dayIndex] = { day: formData.date_available[dayIndex].trim(), slots: daySlots };
    
    setTimeSlots(newTimeSlots);

    const newFormData = { ...formData };
    newFormData.time = newTimeSlots.map(daySlot => ({
        day: daySlot.day.trim(),
        slots: daySlot.slots.map(slot => ({
            starting_time: slot.starting_time,
            ending_time: slot.ending_time
        }))
    }));
    setFormData(newFormData);
};

    const cleanDates = formData.date_available.map(date => date.trim().toLowerCase().replace(/\s+/g, ''));

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
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                        const cleanDay = day.trim().toLowerCase().replace(/\s+/g, '');
                        const isChecked = cleanDates.includes(cleanDay);

                        return (
                            <label key={day}>
                                <input
                                    type="checkbox"
                                    name={day.trim()}
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                                {day}
                            </label>
                        );
                    })}
            </div>
            {editMode ? ( 
                <button type="button" onClick={updateDoctor}>Update</button>
            ) : (
                <button type="submit" onClick={addDoctor}>Add</button>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
};

export default AddForm;