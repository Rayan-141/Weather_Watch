# 🌤️ Weather Watch

![Weather Watch Banner](https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1000&auto=format&fit=crop)

> A beautiful, real-time weather dashboard built with the MERN Stack. Monitor weather conditions, get live alerts, and save your favorite locations.

## 🚀 Live Demo

**Frontend (GitHub Pages):** [https://Rayan-141.github.io/Weather_Watch/](https://Rayan-141.github.io/Weather_Watch/)  
**Backend (Render):** [https://weather-watch-backend.onrender.com/](https://weather-watch-backend.onrender.com/)

---

## ✨ Features

-   **🌍 Real-Time Weather**: Accurate current weather data using Open-Meteo API.
-   **📅 7-Day Forecast**: Plan your week with detailed forecasts.
-   **🔐 User Authentication**: Secure Login and Signup using JWT & Bcrypt.
-   **📍 Location Management**: Save and manage your favorite cities (MongoDB).
-   **⚠️ Weather Alerts**: Set custom alerts for rain, temperature, and more.
-   **🎨 Glassmorphism UI**: Modern, sleek, and responsive design.

---

## 🛠️ Tech Stack

### Frontend
-   **React (+Vite)**: Fast and dynamic user interface.
-   **CSS3**: Custom styling with Glassmorphism effects.
-   **React Router**: Seamless navigation.

### Backend
-   **Node.js & Express**: Robust REST API.
-   **MongoDB Atlas**: Cloud-native database for users and alerts.
-   **Mongoose**: Elegant ODM for MongoDB.

---

## ⚙️ Installation & Local Setup

Want to run this locally? Follow these steps:

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
    -   Create a `.env` file in the `server/` directory:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        PORT=5001
        FRONTEND_URL=http://localhost:5173
        ```

5.  **Run the App**
    -   **Backend**: `cd server && npm start`
    -   **Frontend**: `npm run dev`

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

---

Made with ❤️ by **Rayan**
