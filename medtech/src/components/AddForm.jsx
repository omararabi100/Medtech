import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddForm = ({ formData, handleInputChange, handleCheckboxChange, addDoctor, errorMessage }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <form className="addform">

            <div className="containers">
                <label htmlFor=""> full name
                <input type="text" placeholder="Full name" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                </label>
                <label htmlFor="">
                Phone number

                <input type="tel" placeholder="Phone number" name="phone_nb" value={formData.phone_nb} onChange={handleInputChange} />
                </label>
            </div>
            <label>
                Starting Date:
                <input
                    type="date"
                    name="starting_date"
                    value={formData.starting_date}
                    onChange={handleInputChange}
                    min={currentDate} 

                />
            </label>
            <div className="containers">
                <label>
                    <input type="checkbox" name="Monday" checked={formData.date_available.includes("Monday")} onChange={handleCheckboxChange} />
                    Monday
                </label>
                <label>
                    <input type="checkbox" name="Tuesday" checked={formData.date_available.includes("Tuesday")} onChange={handleCheckboxChange} />
                    Tuesday
                </label>
                <label>
                    <input type="checkbox" name="Wednesday" checked={formData.date_available.includes("Wednesday")} onChange={handleCheckboxChange} />
                    Wednesday
                </label>
                <label>
                    <input type="checkbox" name="Thursday" checked={formData.date_available.includes("Thursday")} onChange={handleCheckboxChange} />
                    Thursday
                </label>
                <label>
                    <input type="checkbox" name="Friday" checked={formData.date_available.includes("Friday")} onChange={handleCheckboxChange} />
                    Friday
                </label>
                <label>
                    <input type="checkbox" name="Saturday" checked={formData.date_available.includes("Saturday")} onChange={handleCheckboxChange} />
                    Saturday
                </label>
                <label>
                    <input type="checkbox" name="Sunday" checked={formData.date_available.includes("Sunday")} onChange={handleCheckboxChange} />
                    Sunday
                </label>
            </div>

            <div>
                <label htmlFor=""> start time:
                    <input type="time" placeholder="Starting Time" name="starting_time" value={formData.starting_time} onChange={handleInputChange} />
                </label>
                <label htmlFor=""> End Time:
                    <input type="time" placeholder="Ending Time" name="ending_time" value={formData.ending_time} onChange={handleInputChange} />
                </label>
            </div>
            <button type="submit" onClick={addDoctor}>Add</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
};

export default AddForm;
