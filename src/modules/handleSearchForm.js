import { getLocations } from "./handleAPI";
import renderWeatherData from "./displayWeather";

let locations = null;
const searchContainer = document.getElementById("search-inner-container");
const input = document.querySelector("input[type='text']");
const submitButton = document.querySelector("button[type='submit']");
const errorContrainer = document.getElementById("search-error");

function clearSuggestedLocations() {
  const lastChild = searchContainer.lastElementChild;

  if (lastChild instanceof HTMLUListElement) {
    input.classList.toggle("show-border");
    lastChild.remove();
  }
}

function resetSearchForm() {
  clearSuggestedLocations();
  input.value = "";
  errorContrainer.style.display = "none";
}

function listenCityElements(citiesList) {
  const citiesArray = [...citiesList.children];

  citiesArray.forEach((city, cityIndex) => {
    city.addEventListener("click", () => {
      const coordinates = {
        lat: locations[cityIndex].lat,
        lon: locations[cityIndex].lon,
      };
      resetSearchForm();
      renderWeatherData(coordinates);
    });
  });
}

function createLocationElement(location) {
  const locationElement = document.createElement("li");
  const locationDescription = document.createElement("span");

  locationDescription.textContent =
    location.country === "US"
      ? `${location.name}, ${location.state}, ${location.country}`
      : `${location.name}, ${location.country}`;

  locationElement.appendChild(locationDescription);

  return locationElement;
}

function suggestLocations() {
  clearSuggestedLocations();

  const citiesList = document.createElement("ul");

  const locationElements = locations.map((location) =>
    createLocationElement(location)
  );

  citiesList.append(...locationElements);

  searchContainer.appendChild(citiesList);
  listenCityElements(citiesList);

  input.classList.toggle("show-border");
}

function showError() {
  errorContrainer.style.display = "block";
}

async function handleSearchForm() {
  errorContrainer.style.display = "none";

  const cityName = input.value.trim();

  if (cityName.length === 0) {
    showError();
    return;
  }

  locations = await getLocations(cityName);

  if (locations.length === 0) {
    showError();
    return;
  }

  suggestLocations();
}

export default function initSearchForm() {
  document.addEventListener("click", (event) => {
    if (!searchContainer.contains(event.target)) {
      clearSuggestedLocations();
    }
  });
  input.addEventListener("focus", clearSuggestedLocations);
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchForm();
    }
  });
  submitButton.addEventListener("click", handleSearchForm);
  renderWeatherData({ lat: 51.5085, lon: -0.1257 });
}
