import React, { useState } from "react";
import "./Header.css";
import { getCountryCode, getCityNameFromCoords } from "../../services/weatherService";
import { useNavigate } from "react-router-dom";

const Header = ({ location, onLocationChange, onSetCurrentLocation }) => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onLocationChange(searchInput);
      setSearchInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = await getCityNameFromCoords(latitude, longitude);
          if (locationData) {
            onSetCurrentLocation(locationData);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <section className="header-section">
      <div>
        <ion-icon name="location-outline"></ion-icon>
        <span>{location.name}, {getCountryCode(location.country)}</span>
      </div>
      <div>
        <div className="search-container">
          <i className="bi bi-search search-icon-left"></i>
          <input
            type="text"
            placeholder="Search for city worldwide...."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <i
            className="bi bi-geo-alt search-icon-right"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      </div>
      <div className="current-location-btn" onClick={handleCurrentLocationClick}>
        <i className="bi bi-crosshair"></i>
        <span>Current Location</span>
      </div>
      <div>
        <button className="signup-btn" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </section>
  );
};

export default Header;
