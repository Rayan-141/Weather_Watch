import React, { useEffect } from "react";
import "./WeatherAlert.css";

const WeatherAlert = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 8000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="weather-alert-overlay">
            <div className="weather-alert-box">
                <div className="weather-alert-header">
                    <span>Alert</span>
                    <span className="close-x" onClick={onClose}>
                        &times;
                    </span>
                </div>
                <div className="weather-alert-body">
                    <p>{message}</p>
                </div>
                <div className="weather-alert-footer">
                    <button onClick={onClose}>OK</button>
                </div>
            </div>
        </div>
    );
};

export default WeatherAlert;
