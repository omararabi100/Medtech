import React from "react";
import { Link } from "react-router-dom"

const Features = () => {
    return (
        <div>
            <h4>Features</h4>
            <ul>
                <li><Link to="/">Risk Prediction</Link></li>
                <li><Link to="/">Get Checked</Link></li>
                <li><Link to="/">Call Doctor</Link></li>
            </ul>
        </div>
    )
}

export default Features