// Simple weather service using Open-Meteo API (no API key needed!)

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// Search for a city and get coordinates
export const searchCity = async (cityName) => {
    try {
        const response = await fetch(`${GEOCODING_API}?name=${cityName}&count=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0];
        }
        return null;
    } catch (error) {
        console.error("Error searching city:", error);
        return null;
    }
};

// Get city name from coordinates (Reverse Geocoding)
export const getCityNameFromCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const data = await response.json();
        return {
            name: data.city || data.locality || "Your Location",
            country: data.countryName,
            latitude: lat,
            longitude: lon,
        };
    } catch (error) {
        console.error("Error reverse geocoding:", error);
        return null;
    }
};

// Get weather data for coordinates
export const getWeatherData = async (lat, lon) => {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,surface_pressure,wind_gusts_10m,is_day",
            hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum",
            timezone: "auto",
            forecast_days: 16,
            past_days: 5,
        });

        const [weatherResponse, airQualityResponse] = await Promise.all([
            fetch(`${WEATHER_API}?${params}`),
            fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`)
        ]);

        const weatherData = await weatherResponse.json();
        const airQualityData = await airQualityResponse.json();

        if (weatherData.current && airQualityData.current) {
            weatherData.current.aqi = airQualityData.current.us_aqi;
        }

        return weatherData;
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null;
    }
};

// Map Open-Meteo weather codes to icon names
export const getWeatherIcon = (weatherCode, isDay = 1) => {
    const day = isDay === 1;

    if (weatherCode === 0) return day ? "clear-day" : "clear-night";
    if (weatherCode === 1) return day ? "few-clouds-day" : "few-clouds-night";
    if (weatherCode === 2) return day ? "partly-cloudy-day" : "partly-cloudy-night";

    if (weatherCode === 3) return "cloudy";
    if (weatherCode >= 45 && weatherCode <= 48) return "cloudy";

    if (weatherCode >= 51 && weatherCode <= 55) return "rain";
    if (weatherCode >= 56 && weatherCode <= 57) return "snow";
    if (weatherCode >= 61 && weatherCode <= 65) return "rain";
    if (weatherCode >= 66 && weatherCode <= 67) return "snow";
    if (weatherCode >= 71 && weatherCode <= 77) return "snow";
    if (weatherCode >= 80 && weatherCode <= 82) return "rain";
    if (weatherCode >= 85 && weatherCode <= 86) return "snow";
    if (weatherCode >= 95 && weatherCode <= 99) return "thunder";

    return day ? "clear-day" : "clear-night";
};

// Get weather description from code
export const getWeatherDescription = (weatherCode) => {
    if (weatherCode === 0) return "Clear sky";
    if (weatherCode === 1) return "Mainly clear";
    if (weatherCode === 2) return "Partly cloudy";
    if (weatherCode === 3) return "Overcast";
    if (weatherCode >= 45 && weatherCode <= 48) return "Foggy";
    if (weatherCode >= 51 && weatherCode <= 67) return "Rainy";
    if (weatherCode >= 71 && weatherCode <= 77) return "Snowy";
    if (weatherCode >= 80 && weatherCode <= 99) return "Showers";
    return "Clear";
};

// Format time to 12-hour format
export const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}${ampm}`;
};

// Format date
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};

// Get country code abbreviation
export const getCountryCode = (countryName) => {
    const countryMap = {
        "United States": "USA",
        "United Kingdom": "UK",
        "United Arab Emirates": "UAE",
        "South Africa": "SA",
        "New Zealand": "NZ",
        "Saudi Arabia": "SA",
    };
    return countryMap[countryName] || countryName;
};

// --- Backend Integration ---

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'x-auth-token': token
    };
};


export const saveLocationToDB = async (name, lat, lon) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found, skipping saveLocation");
            return;
        }

        console.log("Saving location:", name);
        const res = await fetch(`${API_URL}/locations`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, latitude: lat, longitude: lon })
        });
        if (!res.ok) console.error("Failed to save location:", await res.text());
    } catch (error) {
        console.error("Error saving location:", error);
    }
};

export const saveAlertToDB = async (type, condition, threshold, message) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        await fetch(`${API_URL}/alerts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ type, condition, threshold, message })
        });
    } catch (error) {
        console.error("Error saving alert:", error);
    }
};
