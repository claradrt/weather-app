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

function formatDayFromApi(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  console.log(day);
  let days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  return days[day];
}

let now = new Date();
let currentDateAndTimeElement = document.querySelector(".local-date");
currentDateAndTimeElement.innerHTML = formatDate(now);

//GET AND DISPLAY WEATHER INFORMATION
let unit = "metric";
function displayCityInfo(city) {
  let cityWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(cityWeatherApi).then(displayWeatherDetails).catch(handleApiError);
}

let temperatureElement = document.querySelector("#current-temperature");
function displayTemperature(response) {
  let localTemperature = Math.round(response.data.main.temp);
  temperatureElement.innerHTML = `${localTemperature}`;
}

let currentWeatherElement = document.querySelector(
  "#current-weather-description"
);
function displayCurrentWeather(response) {
  currentWeatherElement.innerHTML = `${response.data.weather[0].description}`;
}

let windSpeedElement = document.querySelector("#wind-speed");
function displayWindSpeed(response) {
  let wind = Math.round(response.data.wind.speed * 3.6);
  windSpeedElement.innerHTML = `Wind speed: ${wind} km/h`;
}

let humidityElement = document.querySelector("#humidity");
function displayHumidity(response) {
  humidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;
}

let cityElement = document.querySelector("#city-name");
function displayCityName(response) {
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
}

function displayWeatherDetails(response) {
  console.log(response);
  displayTemperature(response);
  displayCurrentWeather(response);
  displayWindSpeed(response);
  displayHumidity(response);
  displayCityName(response);
  displayWeatherIcon(response);
  displayWeatherBackground(response);
  getWeatherForecast(response);
}

function handleSearch(event) {
  console.log(event);
  event.preventDefault();
  let input = document.querySelector("#search-query");
  displayCityInfo(input.value);
  input.value = "";
}

function handleApiError(err) {
  debugger;
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

let currentLocationElement = document.querySelector("#current-location");
currentLocationElement.addEventListener("click", handleCurrentLocation);

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearch);

//Change weather icon based on weather
let currentWeatherIconElement = document.querySelector("#current-weather-icon");
function displayWeatherIcon(response) {
  let iconId = response.data.weather[0].icon;
  currentWeatherIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconId}@2x.png`
  );
}

//Change Background image based on weather
let weathers = {
  "01": "sunny",
  "02": "few-clouds",
  "03": "clouds",
  "04": "clouds",
  "09": "rain",
  10: "rain",
  11: "thunderstorm",
  13: "snow",
  50: "mist",
};

function displayWeatherBackground(response) {
  let iconId = response.data.weather[0].icon;
  let weatherId = iconId.substring(0, 2);
  let backgroundImage = weathers[weatherId];
  document.body.style.backgroundImage = `url("images/${backgroundImage}.jpg")`;
}

//Weather forecast
function getWeatherForecast(response) {
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

function displayWeatherForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".forecast");
  let forecastHTML = `<div class="row gx-5">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      let day = `${formatDayFromApi(forecastDay.dt)}`;
      let maxTemp = `${Math.round(forecastDay.temp.max)}`;
      let minTemp = `${Math.round(forecastDay.temp.min)}`;
      forecastHTML =
        forecastHTML +
        `<div class="col next-day-forecast">
            <div class="day-of-week">${day}</div>
            <img
              src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
              alt="weather-icon"
              id="weather-icon"
            />
            <div class="row min-max-temp">
              <div class="col-6 max-temp">${maxTemp}º</div>
              <div class="col-6 min-temp">${minTemp}º</div>
            </div>
        </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

displayCityInfo("Madrid");
//navigator.geolocation.getCurrentPosition(handleUserPosition);
