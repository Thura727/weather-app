 // FIX: Replaced placeholder API key. GET YOUR OWN KEY from OpenWeatherMap.
    const apiKey = "e24033374d9f834ce419d285205c1291"; 
    const input = document.getElementById("cityInput");
    const searchButton = document.getElementById("searchButton"); // Get the new button

    // Helper function to handle the search logic
    const handleSearch = () => {
      const city = input.value.trim();
      if (city) {
        getWeather(city);
      } else {
        alert("Please enter a city name.");
      }
    };

    // 1. Event Listener for 'Enter' key press on the input field
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });

    // 2. Event Listener for the 'Search' button click
    searchButton.addEventListener("click", handleSearch);

    async function getWeather(city) {
      try {
        // units=metric gives results in Celsius and meters per second (m/s)
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
        );
        
        if (!res.ok) {
          // Check for specific error codes (e.g., 404 for city not found)
          if (res.status === 404) {
             alert(`Weather data for "${city}" not found.`);
          } else {
             alert("An API error occurred.");
          }
          return;
        }

        const data = await res.json();

        // Update the HTML elements with fetched data
        document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`; // Rounded temperature
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
        document.getElementById("description").textContent = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
        document.getElementById("weatherIcon").textContent = getIcon(data.weather[0].main);
        document.getElementById("updatedAt").textContent = `Updated: ${new Date().toLocaleTimeString()}`; // Time only is better for updates

      } catch (err) {
        console.error("Fetch Error:", err);
        alert("Failed to connect to the weather service.");
      }
    }

    function getIcon(main) {
      const map = {
        Clear: "☀️",
        Clouds: "☁️",
        Rain: "🌧",
        Drizzle: "🌦",
        Thunderstorm: "⛈",
        Snow: "❄️",
        Mist: "🌫",
        Smoke: "🌫",
        Haze: "🌫",
        Fog: "🌫",
      };
      return map[main] || "❓";
    }

    // Call getWeather for a default city on load
    getWeather("Yangon"); 