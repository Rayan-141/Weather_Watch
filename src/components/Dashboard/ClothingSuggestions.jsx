import React from 'react';
import './ClothingSuggestions.css';

const ClothingSuggestions = ({ temp, weatherCode, precipitation }) => {
    const getSuggestions = () => {
        // 1. Rainy (Priority)
        const isRainy = precipitation > 0 || (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 99);

        if (isRainy) {
            return {
                title: "🌧️ Rainy Weather",
                items: [
                    "Waterproof jacket",
                    "Waterproof shoes / Floaters / Sandals",
                    "Umbrella / raincoat",
                    "Quick-dry clothing"
                ],
                message: "Stay dry and safe!"
            };
        }

        // 2. Winter (Cold) < 15°C
        if (temp < 15) {
            return {
                title: "❄️ WINTER (Cold Weather)",
                items: [
                    "Hooded jackets",
                    "Thick sweaters",
                    "Woolen caps",
                    "Warm socks",
                    "Insulated shoes"
                ],
                extra: "Optional colors: Black",
                message: "Bundle up to stay warm!"
            };
        }

        // 3. Summer (Hot) > 31°C
        if (temp > 31) {
            return {
                title: "☀️ SUMMER (Hot Weather)",
                items: [
                    "Light T-shirts",
                    "Short-sleeve shirts",
                    "Shorts",
                    "Breathable pants",
                    "Sunglasses"
                ],
                extra: "Optional color: White",
                message: "Stay cool and hydrated!"
            };
        }

        // 4. Warm / Pleasant (26°C - 31°C)
        if (temp >= 26) {
            return {
                title: "🌥️ WARM / PLEASANT",
                items: [
                    "Tshirt (Full-Sleves/polo)",
                    "Shirt",
                    "Cotton Joggers",
                    "Jeans / Pants",
                    "Shoes",
                    "Sandals / Crocs"
                ],
                message: "Great weather to be out!"
            };
        }

        // 5. Spring (Mild) 15°C - 25°C
        return {
            title: "🌤️ SPRING (Mild Weather)",
            items: [
                "Light sweaters",
                "Light jackets",
                "Long-sleeve shirts",
                "Comfortable trousers / jeans",
                "Light scarf (optional)",
                "Sneakers / normal shoes"
            ],
            message: "Perfect weather for layers!"
        };
    };

    const suggestion = getSuggestions();

    return (
        <div className="clothing-suggestions-card">
            <h3>Clothing Suggestions</h3>
            <div className="suggestion-content">
                <ul>
                    {suggestion.items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                {suggestion.extra && <p className="extra-note">{suggestion.extra}</p>}
            </div>
        </div>
    );
};

export default ClothingSuggestions;
