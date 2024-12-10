
let cityName = document.querySelector(".weather_city");
let dateTime = document.querySelector(".weather_date_time");
let w_forecast = document.querySelector(".weather_forecast");
let w_icon = document.querySelector(".weather_icon");
let w_temperature = document.querySelector(".weather_temperature");
let w_minTem = document.querySelector(".weather_min");
let w_maxTem = document.querySelector(".weather_max");

let w_feelsLike = document.querySelector(".weather_feelsLike");
let w_humidity = document.querySelector(".weather_humidity");
let w_wind = document.querySelector(".weather_wind");
let w_pressure = document.querySelector(".weather_pressure");

let citySearch = document.querySelector(".weather_search");

// to get the actual country name
const getCountryName = (code) => {
  return new Intl.DisplayNames([code], { type: "region" }).of(code);
};

// to get the date and time
const getDateTime = (dt) => {
  const curDate = new Date(dt * 1000); // Convert seconds to milliseconds
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(curDate);
};

let city = ""; // will be set dynamically

// search functionality
citySearch.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityNameInput = document.querySelector(".city_name");
  city = cityNameInput.value; // use the value from the search input

  getWeatherData(city); // fetch weather for the entered city

  cityNameInput.value = ""; // clear input field after search
});

// Function to fetch weather data based on city or coordinates
const getWeatherData = async (cityParam = null, lat = null, lon = null) => {
  let weatherUrl;
  
  // Determine which API call to make based on input
  if (cityParam) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityParam}&appid=c3572da525465a1ee3169d7dd2ce1c33&units=metric`; // Please Use you Own API
  } else if (lat && lon) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c3572da525465a1ee3169d7dd2ce1c33&units=metric`; // Please Use your Own API
  } else {
    alert('Unable to fetch weather data. Please try again.');
    return;
  }

  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();
    
    if (data.cod === 200) {
      const { main, name, weather, wind, sys, dt } = data;

      cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
      dateTime.innerHTML = getDateTime(dt);

      w_forecast.innerHTML = weather[0].main;
      w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`;

      w_temperature.innerHTML = `${main.temp}&#176;C`; // Display temperature in Celsius
      w_minTem.innerHTML = `Min: ${main.temp_min.toFixed()}&#176;C`;
      w_maxTem.innerHTML = `Max: ${main.temp_max.toFixed()}&#176;C`;

      w_feelsLike.innerHTML = `${main.feels_like.toFixed(2)}&#176;C`;
      w_humidity.innerHTML = `${main.humidity}%`;
      w_wind.innerHTML = `${wind.speed} m/s`;
      w_pressure.innerHTML = `${main.pressure} hPa`;
    } else {
      alert('City not found. Please try again!');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to fetch weather data. Please try again later.');
  }
};

// Function to get user's current location
const getUserLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Fetch weather data using coordinates
        getWeatherData(null, latitude, longitude);
      },
      (error) => {
        // Error callback
        console.error("Error getting location:", error);
        
        // Fallback to a default city if geolocation fails
        getWeatherData("New York");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    // Geolocation is not supported
    console.error("Geolocation is not supported by this browser.");
    
    // Fallback to a default city
    getWeatherData("New York");
  }
};

// Call getUserLocation when the page loads
document.addEventListener('DOMContentLoaded', getUserLocation);

// search functionality remains the same
citySearch.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityNameInput = document.querySelector(".city_name");
  city = cityNameInput.value; // use the value from the search input

  getWeatherData(city); // fetch weather for the entered city

  cityNameInput.value = ""; // clear input field after search
});