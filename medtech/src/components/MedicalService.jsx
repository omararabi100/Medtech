import React from "react";
import { images } from "../../image";
import { Link } from 'react-router-dom';

const MedicalService = (props) => {
    return (
        <div className="Service-container">
            <div className="image-title-div">
                <img className="image-title-img" width={props.width} src={props.img} alt="" />
                <h3 className="image-title-title">{props.title}</h3>
            </div>
            <p>{props.context}</p>
            <Link to={props.location} style={{ textDecoration: 'none' }}><button className="Upload-img-btn" onClick={() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth" // This will animate the scroll behavior
                });
            }}>{props.btncontext}</button></Link>
        </div>
    )
}

export default MedicalService