
let weather = {
  apiKey: "a5f3a7f83aeddf5950889b7a60f0eb58",
  unsplashApiKey: "h1MR2in1J8OBLDDTL_maRpeBzLx-LSwB-cUWo5OkHwU",  //Unsplash API key

  // Fetch weather data using async/await
  fetchWeather: async function (city) {
    try {
      document.querySelector(".weather").classList.add("loading"); // Show loading state

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error("No weather found.");
      }

      const data = await response.json();
      this.displayWeather(data);
    } catch (error) {
      this.showError(error.message);
    }
  },

  // Display fetched weather data
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description, main } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = `Weather in ${name}`;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = `${temp}°C`;
    document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
    document.querySelector(".weather").classList.remove("loading");

    // Set background based on weather condition
    this.setBackground(main);
  },

  // Dynamically set background based on weather condition
  setBackground: function (weatherCondition) {
    let backgroundQuery = "landscape"; // Default
    const conditions = {
      Clear: "sunny",
      Clouds: "cloudy",
      Rain: "rainy",
      Snow: "snowy",
      Thunderstorm: "storm",
      Drizzle: "drizzle",
      Mist: "fog",
      Fog: "foggy",
      Haze: "hazy",
    };

    if (conditions[weatherCondition]) {
      backgroundQuery = conditions[weatherCondition];
    }

    // Fetch image using Unsplash API with access key
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${backgroundQuery}&client_id=${this.unsplashApiKey}&orientation=landscape&count=1`;

    this.loadBackgroundImage(unsplashUrl);
  },

  // Load background image from Unsplash API
  loadBackgroundImage: function (url) { 
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const imageUrl = data[0]?.urls?.regular;
        if (imageUrl) {
          document.body.style.backgroundImage = `url('${imageUrl}')`; // Apply background once image is loaded
        } else {
          this.setDefaultBackground();  // If no image is returned, set a default image
        }
      })
      .catch(() => {
        this.setDefaultBackground();  // If there's an error, set a fallback image
      });
  },

  // Fallback background in case of error or no image found
  setDefaultBackground: function () {
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?landscape')`; // Default fallback image
  },

  // Show error messages
  showError: function (message) {
    document.querySelector(".weather").innerHTML = `<h2 class="error">${message}</h2>`;
    this.setDefaultBackground(); // Fallback background for errors
  },

  // Get search input and fetch weather
  search: function () {
    const city = document.querySelector(".search-bar").value.trim();
    if (city) {
      this.fetchWeather(city);
    }
  },
};

// Event listeners for search button and Enter key
document.querySelector(".search button").addEventListener("click", () => weather.search());

document.querySelector(".search-bar").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    weather.search();
  }
});

// Fetch default city weather on page load
weather.fetchWeather("Mumbai");
