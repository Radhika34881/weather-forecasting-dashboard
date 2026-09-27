/* =========================================
   API
========================================= */

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* =========================================
   ELEMENTS
========================================= */

const searchForm =
    document.getElementById("searchForm");

const cityInput =
    document.getElementById("cityInput");

const locationBtn =
    document.getElementById("locationBtn");

const statusBox =
    document.getElementById("status");

const cityName =
    document.getElementById("cityName");

const dateTime =
    document.getElementById("dateTime");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weatherDescription");

const feelsLike =
    document.getElementById("feelsLike");

const windSpeed =
    document.getElementById("windSpeed");

const humidity =
    document.getElementById("humidity");

const clouds =
    document.getElementById("clouds");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const windDirection =
    document.getElementById("windDirection");

const hourlyForecast =
    document.getElementById("hourlyForecast");

const weeklyForecast =
    document.getElementById("weeklyForecast");

const currentTime =
    document.getElementById("currentTime");


/* =========================================
   WEATHER CODES
========================================= */

const weatherInfo = {

    0: {
        description: "clear sky",
        icon: "☀️"
    },

    1: {
        description: "mainly clear",
        icon: "🌤️"
    },

    2: {
        description: "partly cloudy",
        icon: "⛅"
    },

    3: {
        description: "overcast clouds",
        icon: "☁️"
    },

    45: {
        description: "fog",
        icon: "🌫️"
    },

    48: {
        description: "fog",
        icon: "🌫️"
    },

    51: {
        description: "light drizzle",
        icon: "🌦️"
    },

    53: {
        description: "moderate drizzle",
        icon: "🌦️"
    },

    55: {
        description: "dense drizzle",
        icon: "🌧️"
    },

    61: {
        description: "slight rain",
        icon: "🌦️"
    },

    63: {
        description: "moderate rain",
        icon: "🌧️"
    },

    65: {
        description: "heavy rain",
        icon: "🌧️"
    },

    71: {
        description: "slight snow",
        icon: "🌨️"
    },

    73: {
        description: "moderate snow",
        icon: "❄️"
    },

    75: {
        description: "heavy snow",
        icon: "❄️"
    },

    80: {
        description: "slight rain",
        icon: "🌦️"
    },

    81: {
        description: "moderate rain",
        icon: "🌧️"
    },

    82: {
        description: "heavy rain",
        icon: "⛈️"
    },

    95: {
        description: "thunderstorm",
        icon: "⛈️"
    },

    96: {
        description: "thunderstorm with hail",
        icon: "⛈️"
    },

    99: {
        description: "heavy thunderstorm",
        icon: "⛈️"
    }

};


/* =========================================
   WIND DIRECTION
========================================= */

function getWindDirection(degrees) {

    const directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"
    ];

    const index =
        Math.round(degrees / 45) % 8;

    return directions[index];
}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "short"
        }
    );
}


/* =========================================
   TIME FORMAT
========================================= */

function formatTime(timeString) {

    const date =
        new Date(timeString);

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    );
}


/* =========================================
   STATUS
========================================= */

function showStatus(message) {

    statusBox.textContent =
        message;
}


/* =========================================
   GET CITY
========================================= */

async function getCityCoordinates(city) {

    const url =
        `${GEOCODING_API}` +
        `?name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=en` +
        `&format=json`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Unable to search city."
        );

    }

    const data =
        await response.json();

    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            "City not found. Try another city."
        );

    }

    return data.results[0];
}


/* =========================================
   GET WEATHER
========================================= */

async function getWeather(
    latitude,
    longitude
) {

    const url =
        `${WEATHER_API}` +

        `?latitude=${latitude}` +

        `&longitude=${longitude}` +

        `&current=` +
        `temperature_2m,` +
        `relative_humidity_2m,` +
        `apparent_temperature,` +
        `weather_code,` +
        `wind_speed_10m,` +
        `wind_direction_10m,` +
        `surface_pressure,` +
        `cloud_cover,` +
        `visibility` +

        `&hourly=` +
        `temperature_2m,` +
        `weather_code` +

        `&daily=` +
        `weather_code,` +
        `temperature_2m_max,` +
        `temperature_2m_min,` +
        `precipitation_probability_max,` +
        `wind_speed_10m_max` +

        `&timezone=auto` +

        `&forecast_days=7`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Weather data could not be loaded."
        );

    }


    return await response.json();
}


/* =========================================
   DISPLAY WEATHER
========================================= */

function displayWeather(
    location,
    data
) {

    const current =
        data.current;


    const info =
        weatherInfo[
            current.weather_code
        ] || {
            description: "Unknown",
            icon: "🌤️"
        };


    /* Location */

    cityName.textContent =
        `${location.name}` +
        `${
            location.country_code
                ? ", " + location.country_code
                : ""
        }`;


    dateTime.textContent =
        formatDate(
            current.time
        );


    /* Main weather */

    weatherIcon.textContent =
        info.icon;


    temperature.textContent =
        `${Math.round(
            current.temperature_2m
        )}°C`;


    weatherDescription.textContent =
        info.description;


    /* Air conditions */

    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    /*
       Convert Open-Meteo km/h
       to m/s for screenshot-style UI
    */

    const windMS =
        current.wind_speed_10m /
        3.6;


    windSpeed.textContent =
        windMS.toFixed(2);


    humidity.textContent =
        current.relative_humidity_2m;


    clouds.textContent =
        current.cloud_cover;


    pressure.textContent =
        Math.round(
            current.surface_pressure
        );


    visibility.textContent =
        (
            current.visibility / 1000
        ).toFixed(1);


    windDirection.textContent =
        getWindDirection(
            current.wind_direction_10m
        );


    /* Forecast */

    renderHourlyForecast(data);

    renderWeeklyForecast(data);


    showStatus(
        `Weather updated for ${location.name}`
    );
}


/* =========================================
   HOURLY FORECAST
========================================= */

function renderHourlyForecast(data) {

    hourlyForecast.innerHTML = "";


    const times =
        data.hourly.time;

    const temperatures =
        data.hourly.temperature_2m;

    const codes =
        data.hourly.weather_code;


    const currentDate =
        data.current.time.substring(
            0,
            10
        );


    let count = 0;


    for (
        let i = 0;
        i < times.length;
        i++
    ) {

        if (
            !times[i].startsWith(
                currentDate
            )
        ) {
            continue;
        }


        if (count >= 6) {
            break;
        }


        const info =
            weatherInfo[
                codes[i]
            ] || {
                icon: "🌤️",
                description: "weather"
            };


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "hour-card";


        card.innerHTML = `

            <div class="hour-time">
                ${formatTime(times[i])}
            </div>

            <div class="hour-icon">
                ${info.icon}
            </div>

            <div class="hour-temp">
                ${Math.round(
                    temperatures[i]
                )}°C
            </div>

        `;


        hourlyForecast.appendChild(
            card
        );


        count++;

    }

}


/* =========================================
   WEEKLY FORECAST
========================================= */

function renderWeeklyForecast(data) {

    weeklyForecast.innerHTML = "";


    const dates =
        data.daily.time;

    const codes =
        data.daily.weather_code;

    const maxTemps =
        data.daily.temperature_2m_max;

    const minTemps =
        data.daily.temperature_2m_min;

    const rain =
        data.daily
            .precipitation_probability_max;

    const wind =
        data.daily
            .wind_speed_10m_max;


    for (
        let i = 0;
        i < dates.length;
        i++
    ) {

        const info =
            weatherInfo[
                codes[i]
            ] || {
                icon: "🌤️",
                description: "weather"
            };


        const date =
            new Date(
                `${dates[i]}T12:00:00`
            );


        const dayName =
            i === 0
                ? "Today"
                : date.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "long"
                    }
                );


        /*
           Convert daily wind km/h
           to m/s
        */

        const windMS =
            wind[i] / 3.6;


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "day-card";


        card.innerHTML = `

            <div>

                <div class="day-name">
                    ${dayName}
                </div>

                <div class="day-date">
                    ${date.toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short"
                        }
                    )}
                </div>

            </div>


            <div class="day-icon">
                ${info.icon}
            </div>


            <div class="day-description">
                ${info.description}
            </div>


            <div class="day-temp">

                ↑ ${Math.round(
                    maxTemps[i]
                )}°C

                <br>

                ↓ ${Math.round(
                    minTemps[i]
                )}°C

            </div>


            <div class="day-rain">
                💧 ${rain[i]}%
            </div>


            <div class="day-wind">
                ≋ ${windMS.toFixed(2)} m/s
            </div>

        `;


        weeklyForecast.appendChild(
            card
        );

    }

}


/* =========================================
   SEARCH CITY
========================================= */

async function searchCity(city) {

    if (!city) {

        showStatus(
            "Please enter a city name."
        );

        return;
    }


    try {

        showStatus(
            "Loading weather information..."
        );


        const location =
            await getCityCoordinates(
                city
            );


        const data =
            await getWeather(
                location.latitude,
                location.longitude
            );


        displayWeather(
            location,
            data
        );


        cityInput.value =
            `${location.name}` +
            `${
                location.country_code
                    ? ", " +
                      location.country_code
                    : ""
            }`;

    }

    catch (error) {

        console.error(error);

        showStatus(
            error.message ||
            "Something went wrong."
        );

    }

}


/* =========================================
   SEARCH EVENT
========================================= */

searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        searchCity(
            cityInput.value.trim()
        );

    }
);


/* =========================================
   MY LOCATION
========================================= */

locationBtn.addEventListener(
    "click",
    function () {

        if (
            !navigator.geolocation
        ) {

            showStatus(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        showStatus(
            "Getting your location..."
        );


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                try {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;


                    const data =
                        await getWeather(
                            latitude,
                            longitude
                        );


                    const location = {

                        name: "Your Location",

                        country_code: ""

                    };


                    displayWeather(
                        location,
                        data
                    );

                }

                catch (error) {

                    console.error(error);

                    showStatus(
                        "Unable to load weather."
                    );

                }

            },


            function () {

                showStatus(
                    "Location permission was denied."
                );

            }

        );

    }
);


/* =========================================
   LIVE CLOCK
========================================= */

function updateClock() {

    const now =
        new Date();


    const date =
        now.toISOString()
            .slice(0, 10);


    const time =
        now.toTimeString()
            .slice(0, 8);


    currentTime.textContent =
        `${date} ${time} GMT`;

}


setInterval(
    updateClock,
    1000
);


updateClock();


/* =========================================
   DEFAULT WEATHER
========================================= */

searchCity("Chandigarh");