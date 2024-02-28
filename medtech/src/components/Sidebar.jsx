import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function SideBar({translateXValue, showHide}) {
    return (
        <div className='side-bar-container'
        style={{
            transform: `translateX(${translateXValue}%)`,
            transition: 'transform 0.3s ease',
        }}
        >
            <div className='logo-container'>
                <img src="https://cdn-icons-png.flaticon.com/512/2099/2099192.png" className='logo-list' onClick={showHide} />
            </div>
            <div className="link-container-side">
                <Link to="" onClick={showHide} >Home</Link>
                <Link to="risk-prediction-tool" onClick={showHide} >Risk Prediction Tool</Link>
                <Link to="get-checked" onClick={showHide} >Get Checked</Link>
                <Link to="call-now" onClick={showHide} >Call Now</Link>
                <Link to="about-us" onClick={showHide} >About Us</Link>
                <Link to="contact-us" onClick={showHide} >Contact Us</Link>
            </div>
        </div>
    )
}

export default SideBar