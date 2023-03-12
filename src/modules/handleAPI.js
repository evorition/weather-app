const APIKey = "996e62559859a07e044f1ccb7d15d914";
const APIURL = "https://api.openweathermap.org";

async function getLocations(query) {
  const response = await fetch(
    `${APIURL}/geo/1.0/direct?q=${query}&limit=5&appid=${APIKey}`
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

export { getLocations, getWeatherData };
