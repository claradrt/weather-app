let currentDateAndTime = document.querySelector(".local-date");
let apiKey = "d4b52f25cca475cc7e5c04f3d7f22761";

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hour = date.getHours();
  let minutes = date.getMinutes();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hour}:${minutes}`;
}

let now = new Date();
currentDateAndTime.innerHTML = formatDate(now);

let unit = "metric";
let temperature = document.querySelector("#current-temperature");

displayCityInfo("Barcelona");

function displayCityInfo(city) {
  let cityWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(cityWeatherApi).then(displayWeatherDetails).catch(handleApiError);
}

function displayTemperature(response) {
  let localTemperature = Math.round(response.data.main.temp);
  temperature.innerHTML = `${localTemperature}`;
}

let currentWeather = document.querySelector("#current-weather");
function displayCurrentWeather(response) {
  currentWeather.innerHTML = `${response.data.weather[0].description}`;
}

let windSpeed = document.querySelector("#wind-speed");
function displayWindSpeed(response) {
  windSpeed.innerHTML = `Wind speed: ${response.data.wind.speed} m/s`;
}

let humidity = document.querySelector("#humidity");
function displayHumidity(response) {
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
}

let city = document.querySelector("#city-name");
function displayCityName(response) {
  city.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
}

function displayWeatherDetails(response) {
  console.log(response);
  displayTemperature(response);
  displayCurrentWeather(response);
  displayWindSpeed(response);
  displayHumidity(response);
  displayCityName(response);
}

function handleSearch(event) {
  console.log(event);
  event.preventDefault();
  let input = document.querySelector("#search-query");
  displayCityInfo(input.value);
  input.value = "";
}

function handleApiError(err) {
  if (err.response.status === 404) {
    alert("City not found");
  }
}

function handleUserPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let endpointUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(endpointUrl).then(displayWeatherDetails).catch(handleApiError);
}

function handleCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleUserPosition);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", handleCurrentLocation);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearch);

let celsius = document.querySelector("#celsius");
let farenheit = document.querySelector("#farenheit");

function handleCelsius(event) {
  event.preventDefault;
  if (celsius.className !== "selected-unit") {
    temperature.innerHTML = convertFarenheitToCelsius(temperature.innerHTML);
    celsius.classList.add("selected-unit");
    farenheit.classList.remove("selected-unit");
  }
}

function handleFarenheit(event) {
  event.preventDefault;
  if (farenheit.className !== "selected-unit") {
    temperature.innerHTML = convertCelsiusToFarenheit(temperature.innerHTML);
    farenheit.classList.add("selected-unit");
    celsius.classList.remove("selected-unit");
  }
}

function convertCelsiusToFarenheit(temperature) {
  let temperatureConverted = Math.round((temperature * 9) / 5 + 32);
  return temperatureConverted;
}

function convertFarenheitToCelsius(temperature) {
  let temperatureConverted = Math.round(((temperature - 32) * 5) / 9);
  return temperatureConverted;
}

celsius.addEventListener("click", handleCelsius);
farenheit.addEventListener("click", handleFarenheit);
