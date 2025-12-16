import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Day from "../../assets/day.svg";
import Night from "../../assets/night.svg";
import CloudyDay1 from "../../assets/cloudy-day-1.svg";
import CloudyNight1 from "../../assets/cloudy-night-1.svg";
import CloudyDay3 from "../../assets/cloudy-day-3.svg";
import CloudyNight3 from "../../assets/cloudy-night-3.svg";
import Cloudy from "../../assets/cloudy.svg";
import Rainy6 from "../../assets/rainy-6.svg";
import Snowy6 from "../../assets/snowy-6.svg";
import Thunder from "../../assets/thunder.svg";
import WeatherAlert from "../Alert/WeatherAlert";
import ClothingSuggestions from "./ClothingSuggestions";

import { HourlyForecast, DailyForecast } from "./Forecast";
import TemperatureGraph from "./TemperatureGraph";
import { getWeatherData, getWeatherIcon, getWeatherDescription, formatDate, getCountryCode, saveAlertToDB } from "../../services/weatherService";

// Import Background Videos
import HotWeather from "../../assets/videos/HotWeather.mp4";
import Foggy from "../../assets/videos/Foggy.mp4";
import RainFall from "../../assets/videos/RainFall.mp4";
import SnowFall from "../../assets/videos/SnowFall.mp4";
import ClearSky from "../../assets/videos/ClearSky.mp4";

// Icon mapping
const iconMap = {
  "clear-day": Day,
  "clear-night": Night,
  "few-clouds-day": CloudyDay1,
  "few-clouds-night": CloudyNight1,
  "partly-cloudy-day": CloudyDay3,
  "partly-cloudy-night": CloudyNight3,
  "cloudy": Cloudy,
  "rain": Rainy6,
  "snow": Snowy6,
  "thunder": Thunder,
};

const Dashboard = ({ location, onLocationChange }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [otherCities, setOtherCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;

      setLoading(true);
      const data = await getWeatherData(location.latitude, location.longitude);
      setWeatherData(data);

      // Check for alert conditions after 5 seconds
      setTimeout(() => {
        if (data && data.current) {
          const temp = data.current.temperature_2m;
          const weatherCode = data.current.weather_code;
          const precipitation = data.current.precipitation;

          if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86) || temp < 0) {
            const msg = "🌨️ Snowfall Alert! Snowfall incoming ⛄";
            setAlertMessage(msg);
            saveAlertToDB("snow", "present", 0, msg);
          } else if (precipitation > 0 || (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 99)) {
            const msg = "🌧️ Rain Alert! Heavy rain detected ☔";
            setAlertMessage(msg);
            saveAlertToDB("rain", "present", 0, msg);
          } else if (temp < 15) {
            const msg = "❄️ Cold Alert! Temperature dip detected 🥶";
            setAlertMessage(msg);
            saveAlertToDB("temperature", "<", 15, msg);
          } else if (temp > 32) {
            const msg = "☀️ Heat Alert! High temperature detected 🥵";
            setAlertMessage(msg);
            saveAlertToDB("temperature", ">", 32, msg);
          } else {
            setAlertMessage(null);
          }
        }
      }, 3000);

      setLoading(false);
    };

    fetchWeather();
  }, [location]);

  // Fetch other cities data
  useEffect(() => {
    const fetchOtherCities = async () => {
      // Large pool of cities to choose from
      const cityPool = [
        { name: "Manchester", lat: 53.4808, lon: -2.2426 },
        { name: "Edinburgh", lat: 55.9533, lon: -3.1883 },
        { name: "Bristol", lat: 51.4545, lon: -2.5879 },
        { name: "York", lat: 53.9600, lon: -1.0873 },
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        { name: "Berlin", lat: 52.5200, lon: 13.4050 },
        { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
        { name: "New York", lat: 40.7128, lon: -74.0060 },
        { name: "Sydney", lat: -33.8688, lon: 151.2093 },
        { name: "Dubai", lat: 25.2048, lon: 55.2708 },
        { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
        { name: "Singapore", lat: 1.3521, lon: 103.8198 },
      ];

      // Randomly select 8 cities
      const shuffled = [...cityPool].sort(() => 0.5 - Math.random());
      const selectedCities = shuffled.slice(0, 8);

      const citiesData = await Promise.all(
        selectedCities.map(async (city) => {
          const data = await getWeatherData(city.lat, city.lon);
          return { name: city.name, data };
        })
      );

      setOtherCities(citiesData);
    };

    fetchOtherCities();
  }, []);

  if (loading || !weatherData) {
    return <div className="dashboard-section">Loading...</div>;
  }

  const current = weatherData.current;
  const hourly = weatherData.hourly;
  const daily = weatherData.daily;

  // Prepare hourly data (Whole day: 12 AM to 11 PM)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayIso = startOfToday.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Find index of Today 00:00 in the hourly data
  // (Data includes 5 past days, so we must skip them)
  const todayStartIndex = hourly.time.findIndex(t => t.startsWith(startOfTodayIso));

  // Fallback to 0 if not found (shouldn't happen)
  const safeStartIndex = todayStartIndex !== -1 ? todayStartIndex : 0;

  const hourlyData = hourly.time.slice(safeStartIndex, safeStartIndex + 25).map((time, i) => {
    const dataIndex = safeStartIndex + i;
    return {
      time: new Date(time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      icon: iconMap[getWeatherIcon(hourly.weather_code[dataIndex], hourly.is_day[dataIndex])],
      temperature: Math.round(hourly.temperature_2m[dataIndex]),
    };
  });

  // Prepare daily data (21 days: 5 past + today + 15 future)
  const dailyData = daily.time.slice(0, 21).map((date, i) => {
    const isToday = new Date(date).toDateString() === new Date().toDateString();
    return {
      day: isToday ? "Today" : formatDate(date),
      icon: iconMap[getWeatherIcon(daily.weather_code[i])],
      max: Math.round(daily.temperature_2m_max[i]),
      min: Math.round(daily.temperature_2m_min[i]),
      isToday: isToday,
    };
  });

  // Prepare temperature graph data (24 hours)
  // Prepare temperature graph data (24 hours window, starting somewhat in past)
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  const currentHourIso = currentHour.toISOString().slice(0, 13); // Match "YYYY-MM-DDTHH"

  // Find index of current hour in hourly data
  const currentHourIndex = hourly.time.findIndex(t => t.startsWith(currentHourIso));

  // Start from 8 hours before current time to position "Now" in left-middle (and ensure it's on an even index)
  const startIdx = Math.max(0, currentHourIndex - 8);
  const endIdx = startIdx + 24;

  const tempGraphData = hourly.time.slice(startIdx, endIdx).map((time, i) => {
    const isNow = (currentHourIndex - startIdx) === i;
    return {
      time: isNow ? "Now" : new Date(time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      temp: isNow ? Math.round(current.temperature_2m) : Math.round(hourly.temperature_2m[startIdx + i]),
    };
  });

  const weatherIcon = iconMap[getWeatherIcon(current.weather_code, current.is_day)];
  const weatherDesc = getWeatherDescription(current.weather_code);

  const getVideoSource = () => {
    if (!current) return ClearSky;
    const { temperature_2m: temp, weather_code: code, precipitation } = current;

    // 1. Snow (Specific Snow Codes)
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return SnowFall;

    // 2. Rain (Rain Codes or Precipitation)
    if (precipitation > 0 || (code >= 51 && code <= 67) || (code >= 80 && code <= 99)) return RainFall;

    // 3. Fog (Fog Codes)
    if (code === 45 || code === 48) return Foggy;

    // 4. Hot (High Temp)
    if (temp > 32) return HotWeather;

    // 5. Cold (Low Temp - showing SnowFall video as requested)
    if (temp <= 5) return SnowFall;

    // Default
    return ClearSky;
  };

  const videoSrc = getVideoSource();

  return (
    <section className="dashboard-section">
      <video key={videoSrc} className="weather-bg-video" autoPlay loop muted playsInline>
        <source src={videoSrc} type="video/mp4" />
      </video>
      {alertMessage && (
        <WeatherAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
      <div className="home">
        <div className="feed-1">
          <div className="feeds">
            <img src={weatherIcon} alt={weatherDesc} />
            <div>
              <div>
                <span>{location.name}, {getCountryCode(location.country)}</span>
                <span>{weatherDesc}</span>
              </div>
              <div>
                <span>
                  {Math.round(current.temperature_2m)} <sup>o</sup>
                </span>
              </div>
            </div>
          </div>
          <div className="details-card">
            <div className="details-widget">
              <i className="bi bi-droplet widget-icon"></i>
              <div className="widget-val">{current.precipitation} mm</div>
              <div className="widget-label">Precipitation</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-wind widget-icon"></i>
              <div className="widget-val">{Math.round(current.wind_speed_10m)} km/h</div>
              <div className="widget-label">Wind</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-moisture widget-icon"></i>
              <div className="widget-val">{current.relative_humidity_2m} %</div>
              <div className="widget-label">Humidity</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-sunglasses widget-icon"></i>
              <div className="widget-val">{Math.round(current.uv_index || 0)}</div>
              <div className="widget-label">UV Index</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-clouds-fill widget-icon"></i>
              <div className="widget-val">{current.cloud_cover} %</div>
              <div className="widget-label">Cloud Cover</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-eye widget-icon"></i>
              <div className="widget-val">10 km</div>
              <div className="widget-label">Visibility</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-speedometer widget-icon"></i>
              <div className="widget-val">{current.surface_pressure} hPa</div>
              <div className="widget-label">Pressure</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-speedometer2 widget-icon"></i>
              <div className="widget-val">{current.aqi ?? "N/A"}</div>
              <div className="widget-label">AQI</div>
            </div>
            <div className="details-widget">
              <i className="bi bi-wind widget-icon"></i>
              <div className="widget-val">{current.wind_gusts_10m} km/h</div>
              <div className="widget-label">Gusts</div>
            </div>
          </div>
        </div>

        <HourlyForecast data={hourlyData} units={{ temperature: "°C" }} />
        <DailyForecast data={dailyData} units={{ temperature: "°C" }} />
        <TemperatureGraph data={tempGraphData} />
        <ClothingSuggestions
          temp={current.temperature_2m}
          weatherCode={current.weather_code}
          precipitation={current.precipitation}
        />
      </div>
      <div className="cities">
        <h2>Other Cities</h2>
        <div className="all-cities">
          {otherCities.map((city, index) => {
            if (!city.data) return null;
            const cityWeather = city.data.current;
            const cityDaily = city.data.daily;
            const cityIcon = iconMap[getWeatherIcon(cityWeather.weather_code, cityWeather.is_day)];
            const cityDesc = getWeatherDescription(cityWeather.weather_code);

            return (
              <div key={index} onClick={() => onLocationChange(city.name)} className="city-item">
                <div>
                  <img src={cityIcon} alt={cityDesc} />
                  <div>
                    <span>{city.name}</span>
                    <span>
                      {cityDesc}. High: {Math.round(cityDaily.temperature_2m_max[0])}° Low:{" "}
                      {Math.round(cityDaily.temperature_2m_min[0])}°
                    </span>
                  </div>
                </div>
                <div>
                  <span>
                    {Math.round(cityWeather.temperature_2m)} <sup>o</sup>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
