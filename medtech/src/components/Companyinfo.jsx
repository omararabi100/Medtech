import React from "react";
import { Link } from "react-router-dom"

const CompanyInfo = () => {
    return (
        <div>
            <h4>Company Info</h4>
            <ul>
                <li><Link to="/about-us" onClick={()=>{window.scrollTo(0, 0)}}>About Us</Link></li>
                <li><Link to="terms-and-conditions" onClick={()=>{window.scrollTo(0, 0)}}>Terms and Conditions</Link></li>
                <li><Link to="privacy-policy" onClick={()=>{window.scrollTo(0, 0)}}>Privacy</Link></li>
            </ul>
        </div>
    )
}

export default CompanyInfo;
