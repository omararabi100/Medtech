import React from "react";
import { images } from "../../image";

const ExpertDerm = ({name,image}) => {
    return (
        <div className="Expert-container">
            <div className="derm-background"></div>
            <div className="dr-img-container">
                    <img src={image} alt={name}/>
                <div className="dr-img-container">
                    <div className="dr-name-container">
                        <p>{name}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpertDerm