import React, { useState, useEffect } from "react";
import RiskPredictionQuestions from "./riskpredictionquestions";
import Riskpredictiontext from "./Riskpredictiontext";
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";
const RiskPredictionTool = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [total, setTotal] = useState(0);
  const navigateTo = useNavigate();

  const handleOptionChange = (name, value) => {
    setSelectedValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let percentage = 0;

    const Gender = selectedValues["gender"] === "Female" ? 0.0016 : selectedValues["gender"] === "Male" ? 0.0274 : 0;
    const Age = selectedValues["age"] === "60+ years" ? 5 : selectedValues["age"] === "40-59 years" ? 2.3 : selectedValues["age"] === "39 years or less" ? 0.301 : 0;
    const Origin = selectedValues["origin"] === "Northen European or UK" ? 0.033 : selectedValues["origin"] === "Other" ? 0.01 : 0;
    const tan = selectedValues["tan"] === "Yes, I burn easily" ? 10 : selectedValues["tan"] === "No,I could get a tan" ? 30 : 0;
    const burn = selectedValues["burn"] === "More than 5" ? 20 : selectedValues["burn"] === "2 to 5" ? 5 : selectedValues["burn"] === "Less than 2" ? 0.5 : 0;
    const sun = selectedValues["sun"] === "None sun" ? 0.5 : selectedValues["sun"] === "1 to 10" ? 10 : selectedValues["sun"] === "More than 10" ? 20 : 0;
    const moles = selectedValues["moles"] === "Many" ? 10 : selectedValues["moles"] === "Some" ? 5 : selectedValues["moles"] === "Few or none" ? 1 : 0;
    const fhistory = selectedValues["history"] === "Yes, there is" ? 5 : selectedValues["history"] === "No one" ? 0.8 : 0;
    const cutout = selectedValues["cutout"] === "None cutout" ? 0.5 : selectedValues["cutout"] === "1 to 10 cutouts" ? 5 : selectedValues["cutout"] === "More than 10 cutouts" ? 20 : 0;
    const cancer = selectedValues["cancer"] === "Yes" ? 80 : selectedValues["cancer"] === "No" ? 10 : 0;

    percentage = (Gender + Age + Origin + burn + moles + fhistory + sun + cancer + tan + cutout) / 10;
    setTotal(percentage);

    // Now that total is set, navigate to the Score_predicted page
    navigateTo("/Score_predicted", { state: { percentage } });
  };

  useEffect(() => {
    console.log(total);
  }, [total]);

  const riskdata = Riskpredictiontext.map((risk) => (
    <RiskPredictionQuestions
      key={risk.id}
      id={risk.id}
      question={risk.question}
      name={risk.name}
      option1={risk.option1}
      option2={risk.option2}
      option3={risk.option3}
      onChange={(value) => handleOptionChange(risk.name, value)}
    />
  ));

  const oddElements = riskdata.filter((element, index) => index % 2 === 0);
  const evenElements = riskdata.filter((element, index) => index % 2 !== 0);

  return (
    <div className="risk-prediction">
      <br />
      <br />
      <h1>Risk Prediction Tool</h1>
      <div>   
        <p>
          Understanding your skin cancer risk is the first step towards
          prevention. Calculate your risk profile now and take control of your
          skin health.
        </p>
      </div>
      <form className="risk-prediction-form" onSubmit={handleSubmit}>
        <div className="risk-prediction-container">
          <div className="column1">
      <h2>Questionnaire</h2>
            {oddElements}
          </div>
          <div className="column2">
            <br /><br /><br />
            {evenElements}
          </div>
        </div>
        <button type="submit">Check</button>
      </form>

    </div>
  );
};

export default RiskPredictionTool;
