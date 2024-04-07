import React, { useState, useEffect, useRef } from 'react';
import Video from 'twilio-video';
import { Button } from '@mui/material';
import $ from "jquery";

const CallButton = ({ doctorId }) => {
  const [token, setToken] = useState(null);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const videoRef = useRef(null);
  console.log(doctorId)
  useEffect(() => {
    const fetchDoctorData = () => {
      $.ajax({
        type: "GET",
        url: "http://localhost:8000/getDoctorInfo.php",
        data: { id: doctorId },
        success: function(data) {
          setPhoneNumber(data.phone_nb);
        },
        error: function(error) {
          console.error("Error fetching doctor data:", error);
        },
      });
    };

    fetchDoctorData();

    const generateToken = async () => {
      const response = await fetch('/api/generate-token');
      const data = await response.json();
      setToken(data.token);
    };

    generateToken();
  }, [doctorId]);

  const openWhatsAppChat = () => {
    const url = `https://wa.me/${phoneNumber}?text=Hello`;
    window.open(url);
  };

  const connectToCall = async () => {
    if (!token) return;

    try {
      const connection = await Video.connect(token, {
        name: 'video-chat',
        video: videoRef,
      });

      setIsCallConnected(true);

      connection.on('disconnected', () => {
        setIsCallConnected(false);
      });
    } catch (error) {
      console.error('Error connecting to call:', error);
    }
  };

  return (
    <div>
      <Button
        variant="success"
        onClick={() => {
          openWhatsAppChat();
          connectToCall();
        }}
      >
        Chat Now
      </Button>
      {isCallConnected && (
        <video ref={videoRef} autoPlay muted />
      )}
    </div>
  );
};

export default CallButton;
