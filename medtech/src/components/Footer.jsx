import React, { useState, useEffect } from "react";
import CompanyInfo from "./Companyinfo";
import Support from "./Support";
import Features from "./Features";
import Skininfo from "./SkinInfo";
import Getintouch from "./GetInTouch";
import { Link } from "react-router-dom";
import $ from "jquery";

const Footer = () => {
    const [contactInfo, setContactInfo] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        $.ajax({
            url: "http://localhost:8000/getAdmin.php",
            type: "GET",
            dataType: "json",
            success: (response) => {
                console.log("Fetched contact info:", response);
                setContactInfo(response);
            },
            error: (xhr, status, error) => {
                console.error("Error fetching contact info:", status, error);
            }
        });
    };

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
                    <Getintouch contactInfo={contactInfo} />
                </div>
            </div>
            <div className="Rights">
                <h6>All Rights Reserved @2024</h6>
            </div>
        </div>
    );
};

export default Footer;
