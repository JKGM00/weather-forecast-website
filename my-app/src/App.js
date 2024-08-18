import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import { Line } from 'react-chartjs-2';

const App = () => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (city) => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      const currentResponse = await Axios.get(currentWeatherURL);
      const forecastResponse = await Axios.get(forecastWeatherURL);

      setWeatherData(currentResponse.data);
      setForecastData(forecastResponse.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching the weather data', error);
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const renderWeather = () => {
    if (!weatherData) return null;

    return (
      <div className="current-weather">
        <h2>Current Weather in {weatherData.name}</h2>
        <p>{weatherData.weather[0].description}</p>
        <p>Temperature: {weatherData.main.temp}°C</p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        <p>Date & Time: {new Date(weatherData.dt * 1000).toLocaleString()}</p>
      </div>
    );
  };

  const renderForecast = () => {
    if (!forecastData) return null;

    const forecastList = forecastData.list.filter((item, index) => index % 8 === 0);

    const labels = forecastList.map(forecast => new Date(forecast.dt * 1000).toLocaleDateString());
    const tempData = forecastList.map(forecast => forecast.main.temp);
    const humidityData = forecastList.map(forecast => forecast.main.humidity);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: tempData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
        },
        {
          label: 'Humidity (%)',
          data: humidityData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value',
          },
        },
      },
    };

    return (
      <div className="forecast">
        <h2>7-Day Forecast</h2>
        <div className="forecast-container">
          {forecastList.map((forecast, index) => (
            <div key={index} className="forecast-item">
              <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
              <p>{forecast.weather[0].description}</p>
              <p>Temp: {forecast.main.temp}°C</p>
              <p>Humidity: {forecast.main.humidity}%</p>
            </div>
          ))}
        </div>
        <Line data={data} options={options} />
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
        />
        {error && <p className="error">{error}</p>}
        {renderWeather()}
        {renderForecast()}
      </header>
    </div>
  );
};

export default App;