import React from "react";
import "./TemperatureGraph.css";

const TemperatureGraph = ({ data }) => {
    // Mock data fallback
    const temperatureData = data || [
        { time: "Now", temp: 24 },
        { time: "2AM", temp: 23 },
        { time: "5AM", temp: 22 },
        { time: "8AM", temp: 25 },
        { time: "11AM", temp: 28 },
        { time: "2PM", temp: 30 },
        { time: "5PM", temp: 29 },
        { time: "8PM", temp: 26 },
    ];

    // Calculate min and max for scaling
    const temps = temperatureData.map((d) => d.temp);
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 5; // Add more space on top for labels
    const tempRange = maxTemp - minTemp;

    // SVG dimensions
    const width = 900;
    const height = 250;
    const padding = 50;

    // Calculate points for the curve
    const points = temperatureData.map((d, i) => {
        const x = padding + (i * (width - 2 * padding)) / (temperatureData.length - 1);
        // Invert Y because SVG y=0 is top
        const y = height - padding - ((d.temp - minTemp) / tempRange) * (height - 2 * padding);
        return { x, y, temp: d.temp, time: d.time };
    });

    // Create smooth curve path
    const createSmoothPath = (points) => {
        if (points.length < 2) return "";
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const xMid = (points[i].x + points[i + 1].x) / 2;
            const yMid = (points[i].y + points[i + 1].y) / 2;
            const cpX1 = (xMid + points[i].x) / 2;
            const cpX2 = (xMid + points[i + 1].x) / 2;
            path += ` Q ${cpX1} ${points[i].y}, ${xMid} ${yMid}`;
            path += ` Q ${cpX2} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`;
        }
        return path;
    };

    // Create area path (close the curve to the bottom)
    const createAreaPath = (points) => {
        if (points.length < 2) return "";
        let path = createSmoothPath(points);
        // Draw line down to bottom-right, then across to bottom-left, then close
        const bottomY = height - padding;
        path += ` L ${points[points.length - 1].x} ${bottomY}`;
        path += ` L ${points[0].x} ${bottomY}`;
        path += " Z";
        return path;
    };

    const pathData = createSmoothPath(points);
    const areaData = createAreaPath(points);

    return (
        <div className="temperature-graph">
            <h3>Today's Temperature</h3>
            <svg viewBox={`0 0 ${width} ${height}`} className="graph-svg">
                {/* Gradient definition */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0, 0, 0, 0.1)" />
                        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <path
                    d={areaData}
                    fill="url(#areaGradient)"
                    stroke="none"
                />

                {/* Temperature curve */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="3"
                    className="temp-curve"
                />

                {/* Data Points and Labels */}
                {points.map((point, i) => {
                    const isNow = point.time === "Now";

                    // Show labels every 2 hours OR if it's "Now"
                    if (i % 2 !== 0 && !isNow) return null;

                    return (
                        <g key={i}>
                            {/* Dot for Now */}
                            {isNow && (
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    fill="#FFD700"
                                    stroke="#fff"
                                    strokeWidth="2"
                                />
                            )}

                            {/* Temperature Label (Above Point) */}
                            <text
                                x={point.x}
                                y={point.y - 15}
                                textAnchor="middle"
                                className={`point-temp-label ${isNow ? 'now-highlight' : ''}`}
                            >
                                {point.temp}°
                            </text>

                            {/* Time Label (Bottom) */}
                            <text
                                x={point.x}
                                y={height - 15}
                                textAnchor="middle"
                                className={`time-label ${isNow ? 'now-highlight-time' : ''}`}
                            >
                                {point.time}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default TemperatureGraph;
