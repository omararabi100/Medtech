import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from "./ImageUploader";
import $ from "jquery";

const AddForm = ({ formData, handleInputChange, handleCheckboxChange, addDoctor, errorMessage, setErrorMessage, setEditMode, setShowAddForm, editMode, editDoctor, editedDoctor, fetchData, setFormData, changetime, setchangetime, updateDoctor , setremovetime }) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        if (editMode) {
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
            setTimeSlots(initialTimeSlots);
        }
    }, [editMode, formData.date_available]);

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

    const removeTimeSlot = (dayIndex, slotIndex) => {
        setchangetime(true);
        setremovetime(true);
        const newTimeSlots = [...timeSlots];
        newTimeSlots[dayIndex].slots.splice(slotIndex, 1);
        setTimeSlots(newTimeSlots);
        console.log(newTimeSlots , 'newtime slot')
        const newFormData = { ...formData };
        newFormData.time = newTimeSlots.map(daySlot => ({
            day: daySlot.day.trim(),
            slots: daySlot.slots.map(slot => ({
                starting_time: slot.starting_time,
                ending_time: slot.ending_time
            }))
        }));
        console.log(newFormData , 'newFormData')
        setFormData(newFormData);
    };

    const cleanDates = formData.date_available.map(date => date.trim().toLowerCase().replace(/\s+/g, ''));

    return (
        <form className="addform">

            <div className="containers">

                <ImageUploader handleImageChange={handleInputChange} formData={formData} editMode={editMode} />
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
                                        {editMode && 
                                        <button className="remove-time" onClick={() => removeTimeSlot(dayIndex, slotIndex)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 69 14"
                                                className="svgIcon bin-top"
                                            >
                                                <g clipPath="url(#clip0_35_24)">
                                                <path
                                                    fill="black"
                                                    d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                                                ></path>
                                                </g>
                                                <defs>
                                                <clipPath id="clip0_35_24">
                                                    <rect fill="white" height="14" width="69"></rect>
                                                </clipPath>
                                                </defs>
                                            </svg>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 69 57"
                                                className="svgIcon bin-bottom"
                                            >
                                                <g clipPath="url(#clip0_35_22)">
                                                <path
                                                    fill="black"
                                                    d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                                                ></path>
                                                </g>
                                                <defs>
                                                <clipPath id="clip0_35_22">
                                                    <rect fill="white" height="57" width="69"></rect>
                                                </clipPath>
                                                </defs>
                                            </svg>
                                            </button>
                                        }
                                        {/* <button type="button" onClick={() => removeTimeSlot(dayIndex, slotIndex)}>Remove Time Slot</button> */}
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
