import React from "react";
import { Link } from "react-router-dom"

const Support = () => {
    return (
        <div>
            <h4>Support</h4>
            <ul>
                <li><Link to="/">FAQ</Link></li>
                <li><Link to="/">Contact</Link></li>
            </ul>
        </div>
    )
}
export default Support