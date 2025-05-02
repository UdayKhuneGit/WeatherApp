let weather = {
    apiKey: "a5f3a7f83aeddf5950889b7a60f0eb58", // OpenWeatherMap API key
    unsplashApiKey: "YOUR_UNSPLASH_ACCESS_KEY", // Unsplash API Access Key (replace with your actual key)
    
    // Function to fetch weather data
    fetchWeather: function (city) {
      // Fetch weather data from OpenWeatherMap API
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => {
          this.displayWeather(data);
          this.fetchBackgroundImage(city); // Fetch the background image after weather data
        });
    },
    
    // Function to display weather data
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
    },
    
    // Function to fetch the background image from Unsplash
    fetchBackgroundImage: function (city) {
      // Use Unsplash API to get a background image based on the city name
      fetch(`https://api.unsplash.com/photos/random?query=${city}&client_id=${this.unsplashApiKey}`)
        .then((response) => {
          if (!response.ok) {
            console.error("Error fetching background image.");
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.length > 0) {
            const imageUrl = data[0].urls.regular;
            document.body.style.backgroundImage = `url('${imageUrl}')`; // Set the background image
          } else {
            // Fallback image if no image is found
            document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?landscape')`;
          }
        })
        .catch((error) => {
          console.error("Error fetching background image: ", error);
          // Fallback to a default image on error
          document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?landscape')`;
        });
    },
    
    // Function to search weather based on user input
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    },
  };
  
  // Event listener for the search button click
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  // Event listener for the "Enter" key in the search bar
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });
  
  // Default weather fetch for a specific city (Mumbai)
  weather.fetchWeather("Mumbai");
  