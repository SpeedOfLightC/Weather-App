const API_KEY = "16f0be5e3d2b219c93e7c463e41f3588";
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dt = new Date();


// Selectors
const searchBtn = document.querySelector("#search-button");
const locationBtn = document.querySelector("#location");
const cityInput = document.querySelector("#searchbar");
const currentTemperature = document.querySelector("#current-temperature");
const weatherDescription = document.querySelector("#weather-type");
const weatherIcon = document.querySelector("#weather-icon");
const currentDate = document.querySelector(".current-time");
const currentLocation = document.querySelector(".current-location");
const forecastItems = document.querySelectorAll(".forecast-item")
const aqiType = document.querySelector(".aqi-type");
const airIndices = document.querySelectorAll(".air-indices .item h2")
const sunriseItem = document.querySelector("#sunrise-time");
const sunsetItem = document.querySelector("#sunset-time");
const humidityItem = document.querySelector("#humidity-value");
const presssureItem = document.querySelector("#pressure-value");
const visibilityItem = document.querySelector("#visibility-value");
const windSpeedItem = document.querySelector("#wind-speed-value");
const feelsLikeItem = document.querySelector("#feels-like-value");
const hourlyForecastItem = document.querySelectorAll(".hourly-forecast .card");


// get weather details
const getWeatherDetails = (name, lat, lon, country, state) => {
	const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
	const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
	const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;


	// fetch current weather details
	fetch(weatherUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// console.log(data);
			currentTemperature.innerHTML = `${(data.main.temp - 273.15).toFixed(2)}°C`;

			weatherDescription.innerHTML = `${data.weather[0].description}`;

			weatherIcon.innerHTML = `<img src=" https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">`;

			currentDate.innerHTML = `
				<p><i class="fa-light fa-calendar"></i> ${weekDays[dt.getDay()]}, ${dt.getDate()} ${months[Number(dt.getMonth())]} ${dt.getFullYear()}</p>
			`;

			currentLocation.innerHTML = `
				<p><i class="fa-light fa-map-marker-alt"></i> ${name}, ${state}, ${country}</p>
			`;

			// Handle sunrise and sunset
			const sunriseTime = new Date(data.sys.sunrise);
			const sunsetTime = new Date(data.sys.sunset);

			const sunriseHours = sunriseTime.getHours();
			const sunriseMinutes = sunriseTime.getMinutes();

			const sunsetHours = sunsetTime.getHours();
			const sunsetMinutes = sunsetTime.getMinutes();

			sunriseItem.innerHTML = `${sunriseHours}:${sunriseMinutes} AM`;
			sunsetItem.innerHTML = `${sunsetHours}:${sunsetMinutes} PM`;

			// Handle humidity, pressure, visibility, wind speed and feels like
			humidityItem.innerHTML = `${data.main.humidity}%`;
			presssureItem.innerHTML = `${data.main.pressure} hPa`;
			visibilityItem.innerHTML = `${(data.visibility / 1000).toFixed(2)} km`;
			windSpeedItem.innerHTML = `${data.wind.speed} m/s`;
			feelsLikeItem.innerHTML = `${(data.main.feels_like - 273.15).toFixed(2)}°C`;


		})
		.catch((error) => {
			alert(`Unable to fetch weather details of ${cityName}`);
		})

	// fetch weather forecast
	fetch(forecastUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// console.log(data);
			let uniqueForecastDays = [];
			let forecastDays = data.list.filter((forecast) => {
				let forecastDate = new Date(forecast.dt_txt).getDate();
				if (!uniqueForecastDays.includes(forecastDate)) {
					return uniqueForecastDays.push(forecastDate);
				}
			});

			forecastDays.shift();
			// console.log(forecastDays);

			forecastItems.forEach((item, index) => {
				let dt = new Date(forecastDays[index].dt_txt);
				item.innerHTML = `
					<div class="icon-wrapper">
                            <img src=" https://openweathermap.org/img/wn/${forecastDays[index].weather[0].icon}@2x.png" alt="">
                            <span>${(forecastDays[index].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p class="forecast-date">${dt.getDate()} ${months[Number(dt.getMonth())]}</p>
                        <p class="forecast-day">${weekDays[Number(dt.getDay())]}</p>				
				`;
			})


			// Handle Hourly Forecast
			hourlyForecastItem.forEach((item, index) => {
				// console.log(item);	
				let dt = new Date(data.list[index].dt_txt);
				let hour = dt.getHours();
				let amPm = "AM";
				if (hour >= 12) amPm = "PM";
				if (hour > 12) hour -= 12;
				if (hour === 0) hour = 12;

				item.innerHTML = `
					<p>${hour} ${amPm}</p>
                    <img src=" https://openweathermap.org/img/wn/${data.list[index].weather[0].icon}.png" alt="">
                    <p>${(data.list[index].main.temp - 273.15).toFixed(2)}&deg;C</p>
				`;
			})
		})
		.catch((error) => {
			alert(`Unable to fetch weather forecast of ${name}`);
		})

	// fetch aqi details
	fetch(airPollutionUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// console.log(data);
			const aqi = data.list[0].main.aqi;
			if (aqi === 1) {
				aqiType.innerHTML = "Good";
				aqiType.style.backgroundColor = "#d4e157";
			} else if (aqi === 2) {
				aqiType.innerHTML = "Fair";
				aqiType.style.backgroundColor = "#ffee58";
			} else if (aqi === 3) {
				aqiType.innerHTML = "Moderate";
				aqiType.style.backgroundColor = "#ffca28";
			} else if (aqi === 4) {
				aqiType.innerHTML = "Poor";
				aqiType.style.backgroundColor = "#ff7043";
			} else if (aqi === 5) {
				aqiType.innerHTML = "Very Poor";
				aqiType.style.backgroundColor = "#ef5350";
			}

			airIndices.forEach((item, index) => {
				if (index === 0) {
					item.innerHTML = `${(data.list[0].components.pm2_5).toFixed(2)}`;
				}
				else if (index === 1) {
					item.innerHTML = `${(data.list[0].components.pm10).toFixed(2)}`;
				}
				else if (index === 2) {
					item.innerHTML = `${(data.list[0].components.so2).toFixed(2)}`;
				}
				else if (index === 3) {
					item.innerHTML = `${(data.list[0].components.co).toFixed(2)}`;
				}
				else if (index === 4) {
					item.innerHTML = `${(data.list[0].components.no).toFixed(2)}`;
				}
				else if (index === 5) {
					item.innerHTML = `${(data.list[0].components.no2).toFixed(2)}`;
				}
				else if (index === 6) {
					item.innerHTML = `${(data.list[0].components.nh3).toFixed(2)}`;
				}
				else if (index === 7) {
					item.innerHTML = `${(data.list[0].components.o3).toFixed(2)}`;
				}
			})

		})
		.catch((error) => {
			alert(`Unable to fetch air pollution details of ${name}`);
		})
}


searchBtn.addEventListener("click", (e) => {
	e.preventDefault();
	let cityName = cityInput.value.trim();
	if (!cityName) {
		alert("Please enter a city name");
		return;
	}

	// fetch the city coordinates
	let geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

	fetch(geocodingUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			let cityName = data[0].name;
			let lat = data[0].lat;
			let lon = data[0].lon;
			let country = data[0].country;
			let state = data[0].state;

			getWeatherDetails(cityName, lat, lon, country, state);

		})
		.catch((error) => {
			alert(`Unable to fetch coordinates of ${cityName}`);
		})


})

locationBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (!navigator.geolocation) {
		alert("Geolocation is not supported by your browser");
		return;
	}

	navigator.geolocation.getCurrentPosition((position) => {
		// console.log(position.coords);
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;
		// console.log(lat, lon);

		const reverseGeocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`;

		fetch(reverseGeocodingUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// console.log(data);
			let cityName = data[0].name;
			let country = data[0].country;
			let state = data[0].state;
			getWeatherDetails(cityName, lat, lon, country, state);
		})
		.catch((error) => {
			alert(`Unable to fetch your location`);
		})
	})
})
