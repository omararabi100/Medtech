// Homedetails.js

import React from "react";

const Homedetails = ({ statistics }) => {
    return (
        <div className="details-div">
            <div>
                <h1>{statistics ? statistics.happy_customers : ""}</h1>
                <p>Happy Customers</p>
            </div>
            <div>
                <h1>{statistics ? statistics.monthly_visitors : ""}</h1>
                <p>Monthly Visitors</p>
            </div>
            <div>
                <h1>{statistics ? statistics.num_doctors : ""}</h1>
                <p>Number of Doctors</p>
            </div>
            <div>
                <h1>{statistics ? statistics.top_partners : ""}</h1>
                <p>Top Partners</p>
            </div>
        </div>
    );
};

export default Homedetails;
