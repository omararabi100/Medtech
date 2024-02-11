import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './components/Header'
import Home from "./components/Home"
import RiskPredectionTool from './components/RiskPredictionTool';
import GetChecked from './components/GetChecked';
import CallNow from './components/CallNow';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Score_predicted from './components/Score_predicted';
import Admin from './components/Admin';
function App() {

  return (
    <div className='main-container'>
        <Header />
            <Routes>
                
                <Route path="" element={<Home />} />
                <Route path="risk-prediction-tool" element={<RiskPredectionTool />} />
                <Route path="get-checked" element={<GetChecked />} />
                <Route path="call-now" element={<CallNow />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="contact-us" element={<ContactUs />} />
                <Route path="score_predicted" element={<Score_predicted />} />
                <Route path="admin-page" element={<Admin />} />

            </Routes>
    </div>
  )
}

export default App
