import React, { useRef } from 'react';
import "./Dashboard.css"; // Reuse dashboard CSS for now or add specific styles there

// --- Horizontal Scroll Logic ---
const Scrollable = ({ children }) => {
    const scrollRef = useRef();

    const handleMouseDown = (e) => {
        const startX = e.pageX;
        const scrollLeft = scrollRef.current.scrollLeft;

        const onMouseMove = (moveEvent) => {
            const x = moveEvent.pageX - startX;
            scrollRef.current.scrollLeft = scrollLeft - x;
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div className="scrollable-wrapper" ref={scrollRef} onMouseDown={handleMouseDown}>
            {children}
        </div>
    );
};

// --- Daily and Hourly Widgets ---
const HourlyWidget = ({ data, units }) => {
    return (
        <div className="forecast-widget">
            <div className="forecast-day">{data.time}</div>
            <img className="forecast-icon" src={data.icon} alt="weather icon" />
            <div className="forecast-temp">{Math.round(data.temperature)} {units.temperature}</div>
        </div>
    );
};

const DailyWidget = ({ data, units }) => {
    return (
        <div className={`forecast-widget ${data.isToday ? 'today-highlight' : ''}`}>
            <div className="forecast-day">{data.day}</div>
            <img className="forecast-icon daily-forecast-icon" src={data.icon} alt="weather icon" />
            <div className="forecast-temp">
                {Math.round(data.max)} {units.temperature}
            </div>
            <div className="forecast-min-temp">
                {Math.round(data.min)} {units.temperature}
            </div>
        </div>
    );
};

// --- Exported Components ---
export const HourlyForecast = ({ data, units }) => (
    <div className="forecast-container">
        <h3 className="section-title">Hourly Forecast</h3>
        <Scrollable>
            {data.map((item, i) => (
                <HourlyWidget key={i} data={item} units={units} />
            ))}
        </Scrollable>
    </div>
);

export const DailyForecast = ({ data, units }) => (
    <div className="forecast-container">
        <h3 className="section-title">21 Days Forecast</h3>
        <Scrollable>
            {data.map((item, i) => (
                <DailyWidget key={i} data={item} units={units} />
            ))}
        </Scrollable>
    </div>
);
