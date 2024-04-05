import React from "react";
import { useLocation } from "react-router-dom";
import ResultContainer from "../result_container"; 
import resultdata from "../result_container_text";
import Footer from "./Footer";

const ScorePredictedPage = () => {
    const location = useLocation();
    const percentage = parseInt(location.state?.percentage) || 0; 
    
    // Filter resultdata based on percentage
    const filteredResults = resultdata.filter(result => {
        if (percentage >= 0 && percentage <= 3) {
            return result.score.includes("Low");
        } else if (percentage >= 4 && percentage <= 8) {
            return result.score.includes("Medium");
        } else if (percentage >= 9) {
            return result.score.includes("High");
        }
        return false;
    });

    const resultComponents = filteredResults.map((result) => (
        <ResultContainer
            key={result.id}
            id={result.id}
            score={result.score}
            step1={result.step1}
            step2={result.step2}
            step3={result.step3}
        />
    ));

    return (
        <div className="risk-prediction-result">
            <h2>Result</h2>
            <p>Know more about your score <br/> <br />
            Your Score: <b>{percentage} /15</b> </p>
            <div className="results-div">
                {resultComponents}
            </div>
            <p>P.S: these results are based on a study done by NIH</p>
        </div>
    );
};

export default ScorePredictedPage;
