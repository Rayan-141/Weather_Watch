const axios = require('axios');

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ msg: 'Latitude and Longitude are required' });
        }

        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index",
            hourly: "temperature_2m,weather_code,precipitation_probability",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum",
            timezone: "auto",
            forecast_days: 16,
            past_days: 5,
        });

        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?${params}`);
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
