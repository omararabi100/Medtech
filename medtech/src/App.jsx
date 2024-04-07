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
import ContactUsSuccess from './components/ContactUsSuccess';
import Article from "./components/Article";
import SideBar from './components/Sidebar';
import FAQs from './components/FAQs';

function App() {
    const [translateXValue, setTranslateXValue] = useState(-100.5)
    const [overlay, setOverlay] = useState('none')
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const toggleLoginPopup = () => {
        setShowLoginPopup(!showLoginPopup);
    };

    const showHide = () => {
        if (translateXValue === 0) {
            setTranslateXValue(-100.5)
            setOverlay('none')
        } else {
            setTranslateXValue(0)
            setOverlay('block')
        }
    }
  return (
        <div className='main-container'>
        <Header showHide={showHide} showLoginPopup={showLoginPopup} />
        <SideBar showHide={showHide} translateXValue={translateXValue}/>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="risk-prediction-tool" element={<RiskPredectionTool />} />
        <Route path="get-checked" element={<GetChecked toggleLoginPopup={toggleLoginPopup} />} />
        <Route path="call-now" element={<CallNow />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="contact-us/success" element={<ContactUsSuccess />} />
        <Route path="score_predicted" element={<Score_predicted />} />
        <Route path="admin-page" element={<Admin />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="dr-page" element={<Drpage />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="/call-now/calendar" element={<Calendar toggleLoginPopup={toggleLoginPopup}/>} />
        <Route path="/calendar" element={<Calendar toggleLoginPopup={toggleLoginPopup}/>} />
        <Route path="/patient-info" element={<Patientinfo />} />
        <Route path="/patient-info/:patient_id"
        element={<Patientinfo />}
        />
        <Route path="/article/:type" element={<Article />} />
        </Routes>
    <Footer />
    <div className="overlay" style={{display: overlay, transition: 'transform 0.5s ease'}} onClick={showHide}></div>
    </div>
    );
}

export default App;
