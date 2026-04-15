// --- Configuration ---
// Replace this with your actual OpenWeatherMap API key
const API_KEY = 'd17c4be79d4eb04cb47df3a9815640eb'; 

// --- DOM Elements ---
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const weatherData = document.getElementById('weatherData');

const cityNameDisplay = document.getElementById('cityName');
const tempDisplay = document.getElementById('temp');
const conditionDisplay = document.getElementById('condition');
const humidityDisplay = document.getElementById('humidity');

// --- Event Listeners ---
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        showError("Please enter a city name.");
    }
});

// Allow hitting "Enter" to search
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// --- Main Fetch Function ---
async function getWeatherData(city) {
    // 1. Reset UI and show loading state
    hideAll();
    loading.classList.remove('hidden');

    try {
        // 2. Fetch data from the API (using metric units for Celsius)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        // 3. Handle HTTP errors (e.g., 404 City Not Found)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check your spelling.");
            } else {
                throw new Error("An error occurred while fetching the data.");
            }
        }

        // 4. Parse the JSON data
        const data = await response.json();

        // 5. Update the UI dynamically
        displayWeather(data);

    } catch (error) {
        // 6. Handle and display errors
        showError(error.message);
    } finally {
        // 7. Hide loading state regardless of success or failure
        loading.classList.add('hidden');
    }
}

// --- Helper Functions ---
function displayWeather(data) {
    cityNameDisplay.textContent = `${data.name}, ${data.sys.country}`;
    tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
    
    // Capitalize the first letter of the weather description
    const description = data.weather[0].description;
    conditionDisplay.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    
    humidityDisplay.textContent = `${data.main.humidity}%`;

    weatherData.classList.remove('hidden');
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

function hideAll() {
    weatherData.classList.add('hidden');
    errorMsg.classList.add('hidden');
    loading.classList.add('hidden');
}