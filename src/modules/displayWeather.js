import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { getWeatherData } from "./handleAPI";

let lastCoordinates = null;
let units = "metric";

const dateTimeDiv = document.getElementById("date-time");
const locationNameH2 = document.getElementById("location-name");
const weatherIcon = document.getElementById("weather-icon");
const temperatureSpan = document.getElementById("temperature");
const weatherDescriptionDiv = document.getElementById("weather-description");
const windSpan = document.getElementById("wind");
const pressureSpan = document.getElementById("pressure");
const humiditySpan = document.getElementById("humidity");
const visibilitySpan = document.getElementById("visibility");

const swicher = document.getElementById("switcher");

function formatTemperature(temperature) {
  return `${Math.round(temperature)}${units === "metric" ? "°C" : "°F"}`;
}

function processWeatherData(weatherData) {
  const windDirections = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
  ];

  const location = `${weatherData.name}, ${weatherData.sys.country}`;

  const dateTime = new Date((weatherData.dt + weatherData.timezone) * 1000);
  const dateTimeISOString = dateTime.toISOString().slice(0, -1);
  const formattedDateTime = format(
    parseISO(dateTimeISOString),
    "MMM dd, HH:mm"
  );

  const windDirection =
    windDirections[(weatherData.wind.deg / 22.5).toFixed(0)];

  const temperature = formatTemperature(weatherData.main.temp);
  const feelsLike = formatTemperature(weatherData.main.feels_like);
  const pressure = `${weatherData.main.pressure}hPa`;
  const humidity = `${weatherData.main.humidity}%`;
  const visibility = `${(weatherData.visibility / 1000).toFixed(1)}km`;
  const description =
    weatherData.weather[0].description[0].toUpperCase() +
    weatherData.weather[0].description.slice(1);
  const icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  const wind = `${weatherData.wind.speed.toFixed(1)}${
    units === "metric" ? "m/s" : "mph"
  } ${windDirection}`;

  return {
    locationName: location,
    dt: formattedDateTime,
    weather: {
      temperature,
      feelsLike,
      pressure,
      humidity,
      visibility,
      description,
      icon,
      wind,
    },
  };
}

async function renderWeatherData(coordinates) {
  const weatherData = await getWeatherData(coordinates, units);
  const processedWeatherData = processWeatherData(weatherData);

  lastCoordinates = coordinates;

  dateTimeDiv.textContent = processedWeatherData.dt;
  locationNameH2.textContent = processedWeatherData.locationName;
  weatherIcon.src = processedWeatherData.weather.icon;
  temperatureSpan.textContent = processedWeatherData.weather.temperature;

  weatherDescriptionDiv.textContent = `Feels like ${processedWeatherData.weather.feelsLike}. ${processedWeatherData.weather.description}.`;

  windSpan.textContent = processedWeatherData.weather.wind;
  pressureSpan.textContent = processedWeatherData.weather.pressure;
  humiditySpan.textContent = processedWeatherData.weather.humidity;
  visibilitySpan.textContent = processedWeatherData.weather.visibility;
}

function switchUnits(event) {
  if (event.target.checked) {
    units = "imperial";
  } else {
    units = "metric";
  }

  renderWeatherData(lastCoordinates);
}

swicher.addEventListener("change", switchUnits);

export default renderWeatherData;
