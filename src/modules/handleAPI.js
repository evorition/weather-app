const APIKey = "996e62559859a07e044f1ccb7d15d914";
const APIURL = "http://api.openweathermap.org";

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

  return {
    city: weatherData.name,
    country: weatherData.sys.country,
    datetime: { epoch: weatherData.dt, timezone: weatherData.timezone },
    weather: {
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`,
      windSpeed: weatherData.wind.speed,
      windDirection: windDirections[(weatherData.wind.deg / 22.5).toFixed(0)],
    },
  };
}

async function getLocations(query) {
  const response = await fetch(
    `${APIURL}/geo/1.0/direct?q=${query},&appid=${APIKey}`
  );
  const locationsData = await response.json();

  return locationsData;
}

async function getWeatherData(coordinates, units) {
  const response = await fetch(
    `${APIURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${units}&appid=${APIKey}`
  );
  const weatherData = await response.json();

  return weatherData;
}

export { getLocations, getWeatherData, processWeatherData };
