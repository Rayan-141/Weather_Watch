import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { searchCity, saveLocationToDB } from "./services/weatherService";

const App = () => {
  const [location, setLocation] = useState(null);

  // Set default location (London) on mount
  useEffect(() => {
    const setDefaultLocation = async () => {
      const defaultCity = await searchCity("Mumbai");
      if (defaultCity) {
        setLocation(defaultCity);
      }
    };
    setDefaultLocation();
  }, []);

  // Handle location change from search
  const handleLocationChange = async (cityName) => {
    const newLocation = await searchCity(cityName);
    if (newLocation) {
      setLocation(newLocation);
      saveLocationToDB(newLocation.name, newLocation.latitude, newLocation.longitude);
    }
  };

  // Handle setting current location directly
  const handleSetCurrentLocation = (locationObj) => {
    setLocation(locationObj);
    saveLocationToDB(locationObj.name, locationObj.latitude, locationObj.longitude);
  };

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header
                location={location}
                onLocationChange={handleLocationChange}
                onSetCurrentLocation={handleSetCurrentLocation}
              />
              <Dashboard location={location} onLocationChange={handleLocationChange} />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

export default App;
