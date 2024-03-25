import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import RiskPredectionTool from './components/RiskPredictionTool';
import GetChecked from './components/GetChecked';
import CallNow from './components/CallNow';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Score_predicted from './components/Score_predicted';
import Admin from './components/Admin';
import TermsAndConditions from './components/TermsAndConditions';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import Drpage from './components/Drpage';
import MyProfile from './components/MyProfile';
import Calendar from "./components/Calendar"
import Patientinfo from "./components/patientinfo";

function App() {
  return (
    <div className='main-container'>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="risk-prediction-tool" element={<RiskPredectionTool />} />
        <Route path="get-checked" element={<GetChecked />} />
        <Route path="call-now" element={<CallNow />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="score_predicted" element={<Score_predicted />} />
        <Route path="admin-page" element={<Admin />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="dr-page" element={<Drpage />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="/call-now/calendar" element={<Calendar />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/patient-info" element={<Patientinfo />} />
        </Routes>
    <Footer />
    </div>
    );
}

export default App;
