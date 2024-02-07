import React from "react";

export default function RiskPredictionQuestions(props) {
    const handleChange = (e) => {
        props.onChange(e.target.value);
    };

    return (
        <div className="section">
            <div className="circle">
                <h1>{props.id}</h1>
            </div>
            <div className="question">
                <p>{props.question}</p>
                <label>
                    <input type="radio" name={props.name} value={props.option1} onChange={handleChange}/> {props.option1}
                </label>
                <label>
                    <input type="radio" name={props.name} value={props.option2} onChange={handleChange}  /> {props.option2}
                </label>
                {props.option3 !=="" ?
                    <label>
                        <input type="radio" name={props.name} value={props.option3} onChange={handleChange} /> {props.option3}
                    </label>
                    :null}
            </div>
        </div>
    );
}
