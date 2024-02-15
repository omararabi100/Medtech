import React from "react";
import { Link } from "react-router-dom";

const Skininfo = () => {
    return (
        <div>
            <h4>Skin Information</h4>
            <ul>
                <li><Link to={`/article/${"melanoma"}`} onClick={()=>{window.scrollTo(0, 0)}}>Melanoma</Link></li>
                <li><Link to={`/article/${"basal"}`} onClick={()=>{window.scrollTo(0, 0)}}>Basal Cell</Link></li>
                <li><Link to="">Customers</Link></li>
                <li><Link to="">API</Link></li>
            </ul>
        </div>
    )
}

export default Skininfo