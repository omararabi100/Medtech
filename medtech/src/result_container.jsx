import React from "react";

export default function result_container(props) {

    return (
        <div className="result_container">
            <div className="score">{props.score} <span>/15</span></div>
            <p>What you should do…</p>
            <ul>
                <li>{props.step1}</li>
                <li>{props.step2}</li>
                <li>{props.step3}</li>
            </ul>
        </div>
    );
}
