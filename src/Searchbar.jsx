import React, { useState } from 'react';

const Searchbar = () => {
    const [cityName, setCityName] = useState('');
    const [weatherData, setWeatherData] = useState({
        name: '',
        temp: '',
        humidity: '',
        windSpeed: '',
        pressure: ''
    });
    const [error, setError] = useState(''); // State for error message

    const handleCityName = (e) => {
        setCityName(e.target.value);
        setError(''); // Reset error on input change
    };

    const fetchWeatherData = async (lat, lon) => {
        const myApi = "5aac0747a4a9c46ace2f74c231775671";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=metric&lat=${lat}&lon=${lon}&appid=${myApi}`);
        const data = await response.json();
        
        // Destructure data and set in state
        const { name, main: { temp, humidity, pressure }, wind: { speed: windSpeed } } = data;
        setWeatherData({ name, temp, humidity, windSpeed, pressure });
    };

    const getLocationWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(latitude, longitude);
            }, (error) => {
                console.error("Geolocation error: ", error);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleWeatherData = async () => {
        const myApi = "5aac0747a4a9c46ace2f74c231775671";
        if (cityName.trim()) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${cityName}&appid=${myApi}`);
            const data = await response.json();

            // Check if the response is successful
            if (response.ok) {
                // Destructure data and set in state
                const { name, main: { temp, humidity, pressure }, wind: { speed: windSpeed } } = data;
                setWeatherData({ name, temp, humidity, windSpeed, pressure });
                setError(''); // Clear any previous errors
            } else {
                // Set an error message if the city is not found
                setError('Please enter a valid city name.');
                setWeatherData({ name: '', temp: '', humidity: '', windSpeed: '', pressure: '' }); // Reset weather data
            }
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleWeatherData(); // Call the search function on Enter key press
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center py-10">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Weather App</h1>
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        placeholder="Enter city name" 
                        value={cityName} 
                        onKeyDown={handleKeyPress}
                        onChange={handleCityName} 
                        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button 
                        onClick={handleWeatherData} 
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                    >
                        Search
                    </button>
                    <button onClick={getLocationWeather} className="ml-2 bg-green-500 text-white p-2 rounded shadow hover:bg-green-600 transition duration-200">
                        My Location
                    </button>
                </div>
                {error && (
                    <p className="mt-4 text-red-500">{error}</p> // Error message
                )}
                {weatherData.name && !error && (
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{weatherData.name}</h2>
                        <div className="flex justify-between items-center">
                            <p className="text-lg">🌡️ Temp: {weatherData.temp}°C</p>
                            <p className="text-lg">💨 Wind: {weatherData.windSpeed} m/s</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-lg">💧 Humidity: {weatherData.humidity}%</p>
                            <p className="text-lg">🌪️ Pressure: {weatherData.pressure} hPa</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Searchbar;
