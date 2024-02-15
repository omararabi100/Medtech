import React from "react";

const FAQs = () => {
    return(
        <div className="faqs-container">
            <h1><span>Frequently Asked Questions</span></h1>
            <h2>1. What is telemedicine?</h2>
            <p>Telemedicine refers to the remote diagnosis and treatment of patients through telecommunications technology, such as video calls, messaging, and image analysis. It allows patients to consult with healthcare professionals without the need for in-person visits.</p>
            <h2>2. How does the image analysis feature work?</h2>
            <p>Our image analysis feature uses advanced algorithms to analyze images of skin lesions uploaded by users. The algorithm compares the characteristics of the lesion against a database of known patterns to provide an assessment of the likelihood of skin cancer. However, it's important to note that the analysis is for informational purposes only and should not replace a diagnosis by a qualified healthcare professional.</p>
            <h2>3. Is the image analysis feature accurate?</h2>
            <p>While we strive for accuracy in our image analysis, there may be limitations or errors in the assessment. We recommend users consult with a dermatologist or other qualified healthcare professional for a definitive diagnosis.</p>
            <h2>4. How do I schedule an appointment with a doctor?</h2>
            <p>To schedule an appointment with a doctor, simply navigate to the scheduling section of our website and choose a date and time that works for you. You can select from a list of available healthcare professionals specializing in dermatology or other relevant fields.</p>
            <h2>5. Are my personal and medical information secure?</h2>
            <p>Yes, we take the security and privacy of user information seriously. We have implemented strict measures to safeguard against unauthorized access, disclosure, or alteration of personal and medical information. Please refer to our Privacy Policy for more information.</p>
            <h2>6. What should I do if I experience technical difficulties during a video call?</h2>
            <p>If you experience technical difficulties during a video call, please try the following troubleshooting steps:</p>
            <ul>
                <li>Check your internet connection and ensure it is stable.</li>
                <li>Refresh your browser or restart the video call application.</li>
                <li>Ensure that your device's camera and microphone are properly connected and configured.
                If the issue persists, please contact our technical support team for assistance.</li>
            </ul>
            <h2>7. Can I use your telemedicine services for emergencies?</h2>
            <p>Our telemedicine services are not suitable for emergencies or urgent medical situations. If you are experiencing a medical emergency, please call your local emergency services or visit the nearest emergency room immediately.</p>
            <h2>8. Is my insurance accepted for telemedicine appointments?</h2>
            <p>We accept various insurance plans for telemedicine appointments, depending on the healthcare professionals available on our platform. Please check with your insurance provider or contact us for more information about accepted insurance plans.</p>
            <h2>Can I access my medical records through your website?</h2>
            <p>At this time, we do not provide access to medical records through our website. However, you can request copies of your medical records from the healthcare professional you consult with during your appointment.</p>
            <h2>How can I provide feedback about my telemedicine experience?</h2>
            <p>We welcome feedback from our users to help improve our services. You can provide feedback by contacting us directly through our website or completing a satisfaction survey after your appointment.</p>
        </div>
    )
}

export default FAQs