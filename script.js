const apiKey = "e24033374d9f834ce419d285205c1291";
const input = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const handleSearch = () => {
  const city = input.value.trim();
  if(city){
    getWeather(city);
    getForecast(city);
  } else {
    alert("Please enter a city name.");
  }
};

input.addEventListener("keyup", e => { if(e.key==="Enter") handleSearch(); });
searchButton.addEventListener("click", handleSearch);

function getIcon(main){
  const map = {Clear:"☀️", Clouds:"☁️", Rain:"🌧", Drizzle:"🌦", Thunderstorm:"⛈", Snow:"❄️", Mist:"🌫", Smoke:"🌫", Haze:"🌫", Fog:"🌫"};
  return map[main] || "❓";
}

async function getWeather(city){
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    if(!res.ok){ if(res.status===404) alert(`Weather data for "${city}" not found.`); else alert("API error."); return; }
    const data = await res.json();
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
    document.getElementById("description").textContent = data.weather[0].description.replace(/\b\w/g,c=>c.toUpperCase());
    document.getElementById("weatherIcon").textContent = getIcon(data.weather[0].main);
    document.getElementById("updatedAt").textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  } catch(err){ console.error(err); alert("Failed to fetch weather data."); }
}

async function getForecast(city){
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    if(!res.ok){ alert("Forecast API error."); return; }
    const data = await res.json();
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML="";

    const dailyMap = new Map();
    data.list.forEach(f=>{
      const date = f.dt_txt.split(" ")[0]; 
      if(!dailyMap.has(date)) dailyMap.set(date,f);
    });

    Array.from(dailyMap.values()).slice(0,5).forEach(f=>{
      const date = new Date(f.dt_txt);
      const dayName = date.toLocaleDateString("en-US",{weekday:"short"});
      const icon = getIcon(f.weather[0].main);
      const temp = Math.round(f.main.temp);

      const dayDiv = document.createElement("div");
      dayDiv.className="forecast-day";
      dayDiv.innerHTML = `<div>${dayName}</div><div class="icon">${icon}</div><div>${temp}°C</div>`;
      forecastContainer.appendChild(dayDiv);
    });
  } catch(err){ console.error(err); }
}

// Load default city
getWeather("Yangon");
getForecast("Yangon");
