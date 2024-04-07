import React from "react";
import { Link } from "react-router-dom"

const Features = () => {
    return (
        <div>
            <h4>Features</h4>
            <ul>
                <li><Link to="/risk-prediction-tool">Risk Prediction</Link></li>
                <li><Link to="/get-checked">Get Checked</Link></li>
                <li><Link to="/call-now">Call Doctor</Link></li>
            </ul>
        </div>
    )
}

export default Features