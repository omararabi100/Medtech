import React from "react";
import { Link } from "react-router-dom"

const CompanyInfo = () => {
    return (
        <div>
            <h4>Company Info</h4>
            <ul>
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/">Terms and Conditions</Link></li>
                <li><Link to="/">Privacy</Link></li>
            </ul>
        </div>
    )
}

export default CompanyInfo;
