const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feels = document.getElementById("feels");
const forecast = document.querySelector(".forecast");

const input = document.getElementById("city");
const button = document.getElementById("searchBtn");


// Get latitude and longitude from city name
async function getCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("Location not found");
    }

    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country
    };
}


// Weather icons
function getWeatherIcon(code) {

    if (code === 0) return "fa-sun";

    if ([1, 2].includes(code))
        return "fa-cloud-sun";

    if (code === 3)
        return "fa-cloud";

    if ([45, 48].includes(code))
        return "fa-smog";

    if ([51, 53, 55, 56, 57].includes(code))
        return "fa-cloud-rain";

    if ([61, 63, 65, 80, 81, 82].includes(code))
        return "fa-cloud-showers-heavy";

    if ([71, 73, 75, 77, 85, 86].includes(code))
        return "fa-snowflake";

    if ([95, 96, 99].includes(code))
        return "fa-cloud-bolt";

    return "fa-cloud";
}


// Get weather using coordinates
async function getWeather(lat, lon) {

    const url = new URL(
        "https://api.open-meteo.com/v1/forecast"
    );

    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);

    url.searchParams.set(
        "current",
        "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code"
    );

    url.searchParams.set(
        "daily",
        "weather_code,temperature_2m_max,temperature_2m_min"
    );

    url.searchParams.set(
        "timezone",
        "auto"
    );


    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather data failed");
        }


        const data = await response.json();

        console.log(data);


        const weatherCodes = {

            0: "Sunny",
            1: "Mainly Sunny",
            2: "Partly Cloudy",
            3: "Cloudy",

            45: "Fog",
            48: "Fog",

            51: "Light Drizzle",
            53: "Drizzle",
            55: "Heavy Drizzle",

            61: "Light Rain",
            63: "Rain",
            65: "Heavy Rain",

            71: "Light Snow",
            73: "Snow",
            75: "Heavy Snow",

            80: "Rain Showers",

            95: "Thunderstorm"
        };


        const currentCondition =
            weatherCodes[data.current.weather_code] || "Unknown";


        // Current weather

        temp.textContent =
            `${data.current.temperature_2m} ${data.current_units.temperature_2m}`;


        condition.textContent =
            currentCondition;


        humidity.textContent =
            `${data.current.relative_humidity_2m}%`;


        wind.textContent =
            `${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`;


        feels.textContent =
            `${data.current.apparent_temperature} ${data.current_units.temperature_2m}`;



        // Forecast

        forecast.innerHTML = "";


        for (let i = 0; i < data.daily.time.length; i++) {


            const day =
                new Date(data.daily.time[i])
                .toLocaleDateString("en-US", {
                    weekday: "short"
                });


            const icon =
                getWeatherIcon(
                    data.daily.weather_code[i]
                );


            forecast.innerHTML += `

                <div class="day">

                    <p>${day}</p>

                    <i class="fa-solid ${icon}"></i>

                    <h3>
                        ${Math.round(
                            data.daily.temperature_2m_max[i]
                        )}°
                    </h3>

                </div>

            `;
        }


    } catch(error) {

        console.error(error);

    }

}



// Search button

button.addEventListener("click", async () => {

    try {

        const city =
            input.value.trim();


        if (!city) {
            alert("Enter a city name");
            return;
        }


        const location =
            await getCoordinates(city);


        console.log(location);


        await getWeather(
            location.latitude,
            location.longitude
        );


    } catch(error) {

        alert(error.message);

    }

});


// Load default city when page opens

(async function(){

    const location =
        await getCoordinates("Lahore");


    await getWeather(
        location.latitude,
        location.longitude
    );

})();