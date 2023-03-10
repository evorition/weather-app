import { getLocations } from "./handleAPI";

let locations = null;
const searchContainer = document.getElementById("search-container");
const input = document.querySelector("input");
const submitButton = document.querySelector("button[type='submit']");

function clearSuggestedLocations() {
  if (searchContainer.lastElementChild.tagName.toLocaleLowerCase() === "ul") {
    searchContainer.lastElementChild.remove();
  }
}

function listenCityElements(citiesList) {
  citiesList.children.forEach((city, cityIndex) => {
    city.addEventListener("click", () => {
      clearSuggestedLocations();
      // Call function with coordinates to show weather in the selected city
    });
  });
}

function suggestLocations() {
  clearSuggestedLocations();

  const citiesList = document.createElement("ul");

  locations.forEach((location) => {
    const locationElement = document.createElement("li");
    const countryFlag = document.createElement("img");
    const locationDescription = document.createElement("span");

    countryFlag.crossOrigin = "anonymous";
    countryFlag.src = `https://countryflagsapi.com/svg/${location.country}`;
    countryFlag.alt = `${location.country} flag`;
    locationDescription.textContent =
      location.country === "US"
        ? `${location.name}, ${location.state}, ${location.country}`
        : `${location.name}, ${location.country}`;

    locationElement.appendChild(countryFlag);
    locationElement.appendChild(locationDescription);
    citiesList.appendChild(locationElement);
  });

  searchContainer.appendChild(citiesList);
  listenCityElements(citiesList);
}

async function handleSearchForm() {
  const cityName = input.value.trim();
  if (cityName.length === 0) {
    // Show error and exit
    return;
  }

  locations = await getLocations(cityName);
  if (locations.length === 0) {
    // Show error and exit
    return;
  }

  suggestLocations(locations);
}

export default function initSearchForm() {
  input.addEventListener("focus", clearSuggestedLocations);
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchForm();
    }
  });
  submitButton.addEventListener("click", handleSearchForm);
}
