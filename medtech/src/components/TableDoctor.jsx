import React from "react";

const TableDoctor = ({
    filteredDoctors,
    editedDoctor,
    deleteDoctor,
    editDoctor,
    handleCheckboxChangeedit,
    handleImageChange,
    updateDoctor,
    setErrorMessage,
    editMode,
    cancelEdit
}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Image</th>
                    <th>Date Available</th>
                    <th> Time</th>
                    <th>Phone Number</th>
                    <th>Starting Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredDoctors && filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>{doctor.id}</td>
                            <td>
                                {editedDoctor && editedDoctor.id === doctor.id ? (
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={editedDoctor.full_name}
                                        onChange={(e) => setEditedDoctor({ ...editedDoctor, full_name: e.target.value })}
                                    />
                                ) : (
                                    doctor.full_name
                                )}
                            </td>
                            <td>
                                {editedDoctor && editedDoctor.id === doctor.id ? (
                                    <input
                                        type="file"
                                        accept=".png, .jpeg, .jpg"
                                        name="image"
                                        onChange={handleImageChange}
                                    />
                                ) : (
                                    doctor.image && (
                                        <img
                                            src={
                                                doctor.image.startsWith('./public')
                                                    ? doctor.image
                                                    : `data:image/${doctor.image.endsWith('.jpg') || doctor.image.endsWith('.jpeg') ? 'jpeg' : 'png'};base64,${doctor.image}`
                                            }
                                            alt="Doctor"
                                            style={{ width: '100px', height: '100px' }}
                                        />
                                    )
                                )}
                            </td>
                            <td>
                                {editedDoctor && editedDoctor.id === doctor.id ? (
                                    <div className="containers">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                <label key={day} style={{ marginRight: '10px' }}>
                                                <input
                                                    type="checkbox"
                                                    name={""+day}
                                                    checked={editedDoctor.date_available.includes(day)}
                                                    onChange={handleCheckboxChangeedit}
                                                />
                                                {day}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    doctor.date_available
                                )}
                            </td>
                            <td>
                            {Array.isArray(doctor.times) && doctor.times.length > 0 ? (
                                    <ul>
                                        {doctor.times.map((timeSlot, index) => (
                                            <li key={index}>
                                                {timeSlot.day}: {timeSlot.slots.map(slot => `${slot.starting_time} - ${slot.ending_time}`).join(', ')}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    setErrorMessage( "Time slots are empty. Please fill them.")
                                    
                                )}
                            </td>

                            <td>
                                {editedDoctor && editedDoctor.id === doctor.id ? (
                                    <input
                                        type="tel"
                                        name="phone_nb"
                                        value={editedDoctor.phone_nb}
                                        onChange={(e) => setEditedDoctor({ ...editedDoctor, phone_nb: e.target.value })}
                                    />
                                ) : (
                                    doctor.phone_nb
                                )}
                            </td>
                            <td>{doctor.starting_date}</td>
                            <td>
                                {editedDoctor && editedDoctor.id === doctor.id ? (
                                    <>
                                        <button onClick={updateDoctor}>Submit</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <button className="edit_btn" onClick={() => editDoctor(doctor.id)}>
                                        <svg class="svg-icon" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="#a649da" stroke-linecap="round" stroke-width="2">
                                                <path d="m20 20h-16"></path>
                                                <path clip-rule="evenodd" d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z" fill-rule="evenodd"></path>
                                            </g>
                                        </svg>
                                    </button>
                                )}
                                <button className="edit_btn" onClick={() => deleteDoctor(doctor.full_name)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                        <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">No doctors found</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableDoctor;
