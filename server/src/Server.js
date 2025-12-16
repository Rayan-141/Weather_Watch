const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/DB');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Load from root if needed, or default

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', // Vite Local
    'http://localhost:4173', // Vite Preview
    'https://Rayan-141.github.io', // Your GitHub Pages
    process.env.FRONTEND_URL // Render Environment Variable
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('github.io')) {
            // For simplicity in development/deployment, we can be lenient or strict
            // allowing all github.io subdomains for now to ensure it works
            // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Define Routes
app.use('/api/users', require('./Routes/UserRouter'));
app.use('/api/locations', require('./Routes/LocationRouter'));
app.use('/api/alerts', require('./Routes/AlertRouter'));
app.use('/api/weather', require('./Routes/WeatherRouter'));

// Root Route for checking status
app.get('/', (req, res) => {
    res.send('Backend is Running and Live!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
