import React from "react";
import { images } from "../../image";

const MedicalService = (props) => {
    return (
        <div className="Service-container">
            <div className="image-title-div">
                <img className="image-title-img" width={props.width} src={props.img} alt="" />
                <h3 className="image-title-title">{props.title}</h3>
            </div>
            <p>{props.context}</p>
            <button className="Upload-img-btn">{props.btncontext}</button>
        </div>
    )
}

export default MedicalService