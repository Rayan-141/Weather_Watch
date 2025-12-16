# 🌤️ Weather Watch

![Weather Watch Banner](https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1000&auto=format&fit=crop)

> **Weather Watch** is a full-stack web application that delivers live weather information, 21-Day forecasts, and real-time alerts. Built with the MERN stack, it provides a beautiful, glassmorphism-styled dashboard for monitoring weather conditions worldwide.

## 🚀 Live Demo

**Frontend (GitHub Pages):** [https://Rayan-141.github.io/Weather_Watch/](https://Rayan-141.github.io/Weather_Watch/)  
**Backend (Render):** [https://weather-watch-backend.onrender.com/](https://weather-watch-backend.onrender.com/)

---

## 📖 Project Overview

Weather Watch allows users to monitor temperature, AQI, humidity, wind, and UV index in real-time. It connects to free weather APIs (Open-Meteo) and uses a custom Geocoding service for precise location tracking.

### 🔌 Backend (Node + Express)
The backend implements secure REST APIs for:
*   **Authentication**: Register/Login using **JWT** (JSON Web Tokens).
*   **Security**: Passwords are hashed with **bcrypt** before storage in **MongoDB**.
*   **Data Aggregation**: The server fetches data from external APIs and normalizes it for the frontend.

### 🎨 Frontend (React)
The frontend is a component-based, user-friendly interface:
*   **Dashboard**: Displays weather cards and visual data immediately upon load.
*   **Visualizations**: Includes line charts for temperature trends and forecasts.
*   **Client-Side Logic**: Evaluates alert rules and provides feedback via UI banners and popups.

---

## ✨ Key Features

-   **🌍 Current Location & Other Cities**: Automatically detects your location or search for any city globally.
-   **📅 21-Day Forecast**: Extended forecast data to plan ahead.
-   **📉 Today's Temp Graph**: Visual line chart showing temperature changes throughout the day.
-   **🧥 Clothing Suggestions**: Smart recommendations (e.g., "Wear a jacket") based on real-time temperature logic.
-   **🕒 Hourly Forecast**: Detailed hour-by-hour weather breakdown.
-   **⚠️ Weather Alerts**: Custom alerts (rain, temperature, snow) with visual UI notifications.
-   **📊 Detailed Stats**: Monitor AQI (Air Quality Index), Humidity, Wind Speed, UV Index, and more.

---

## 🛠️ Tech Stack

### Frontend
-   **React.js**: Dynamic component-based UI.
-   **Vite**: Fast build tool and development server.
-   **CSS3**: Custom styling with modern Glassmorphism effects.

### Backend
-   **Node.js & Express.js**: Scalable server-side logic and API routing.
-   **MongoDB Atlas**: Cloud database for simplified data storage.
-   **Mongoose**: schema-based solution to model application data.
-   **Authentication**: JWT for secure sessions and Bcrypt for password hashing.

---

## ☁️ Deployment Status

| Service | Platform | Status |
| :--- | :--- | :--- |
| **Frontend** | GitHub Pages | 🟢 Live |
| **Backend** | Render | 🟢 Live (Auto-Deploy) |
| **Database** | MongoDB Atlas | 🟢 Connected |

*(Note: Bugs related to Login/Signup and generic Server Errors have been resolved.)*

---

## ⚙️ Installation & Local Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Rayan-141/Weather_Watch.git
    cd Weather_Watch
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd server
    npm install
    cd ..
    ```

4.  **Configure Environment Variables**
    Create a `.env` file in the `server/` directory:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5001
    FRONTEND_URL=http://localhost:5173
    ```

5.  **Run the App**
    *   **Backend**: `cd server && npm start`
    *   **Frontend**: `npm run dev`

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

---

Made with ❤️ by **Rayan**
