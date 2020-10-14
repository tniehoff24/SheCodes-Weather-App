function formatDate(date) {
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let hours = date.getHours();
  if (hours > 12) {
    hours = `${hours - 12}:${minute} PM`;
  } else {
    hours = `${hours}:${minute} AM`;
  }
  let number = date.getDate();
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];
  let monthIndex = date.getMonth();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let month = months[monthIndex];

  return `${day}, ${number} ${month}  at ${hours}`;
}
function formatDay(dtTime){
  let date = new Date(dtTime);
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];
  return day;
}

function displayForecast(response) {
  console.log(response);
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (index = 1; index < 6; index++) {
    forecast = response.data.daily[index];
    let dtTime = formatDay(forecast.dt*1000);
    forecastElement.innerHTML += `
      <div class="card" id="forecast">
        <h5>
          <strong>
          ${Math.round(forecast.temp.max)}°
          </strong>
        /${Math.round(forecast.temp.min)}°
        </h5>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
          alt="Conditions Icon"
          class="mx-auto"
          height="60"
          width="60"
          id="icon-forecast"/>
        <p>
        ${dtTime}
        </p>
      </div>
    `;
  }
}

function showTemperature(response) {
  console.log(response);
   let iconElement = document.querySelector("#icon-main")
   let lat = response.data.coord.lat;
   let lon = response.data.coord.lat;
  document.querySelector("#current-city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#today-temp").innerHTML = `${Math.round(
    celsiusTemperature
  )}°`;
    document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )} Knots`;
  document.querySelector(
    "#condition"
  ).innerHTML = `Conditions: ${response.data.weather[0].main}`;
iconElement.setAttribute(
  "src",
  `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
);
//Calling Geocode Forecast API
let apiKey = "bf71e32409a6d0dde84d4b8e435cc431";
let tempUnits = "metric";
apiCityLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${tempUnits}`
axios.get(apiCityLink).then(displayForecast);
}

function showCityTemp(city) {
  let apiKey = "bf71e32409a6d0dde84d4b8e435cc431";
  let tempUnits = "metric";
  let apiCityLink = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${tempUnits}`;
  axios.get(apiCityLink).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#text-input-city").value;
  showCityTemp(city);
}

function showGeoTemp(position) {
  let apiKey = "bf71e32409a6d0dde84d4b8e435cc431";
  let tempUnits = "metric";
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiGeoLink = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${tempUnits}`;
  axios.get(apiGeoLink).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showGeoTemp);
}

function changeCelsius(event) {
  event.preventDefault();
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  let temperatureElement = document.querySelector("#today-temp");
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
}

letcelsiusTemperature= null;

function changeFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#today-temp");

  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°`;
}

//Feature 1: Display current Date and Time
let dateElement = document.querySelector("#date");
let now = new Date();
dateElement.innerHTML = formatDate(now);

//Feature 2: Add search engine and display name after user submits the form

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

//Feature 3: Display fake temperature (16/66) that converts when you click on celsius or Fareignheit
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", changeFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", changeCelsius);

//Feature 4: Searching for Temperature
let refreshButton = document.querySelector("#refresh-button");
refreshButton.addEventListener("click", getCurrentLocation);

showCityTemp("Baltimore");
