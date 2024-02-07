import CompanyInfo from "./Companyinfo"; 
import Support from "./Support"
import Features from "./Features"
import Skininfo from "./SkinInfo"
import Getintouch from "./GetInTouch"
import { Link } from "react-router-dom"

import React from "react"

const Footer = () => {
    return (
        <div>

            <div className="footer">
                <h2>Med<span>Tech</span></h2>
            <div className="footer-div-container">
                <div className="footer-div">
                        <CompanyInfo />
                        <Support />
                </div>
                <div className="footer-div">
                    <Features />
                    <Skininfo />
                </div>
            </div>
                <div className="footer-div">
                    <Getintouch />
                </div>
            </div>
            <div className="Rights">
                <h6>All Rights Reserved @2024</h6>
            </div>
        </div>
        
    )
}

export default Footer