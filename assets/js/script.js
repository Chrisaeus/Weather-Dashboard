const apiKey = "3b64edad468d56e62a18ce53bbd20378";

const searchCol = document.querySelector(".searchCol");
const searchBar = document.querySelector("#searchBar");
const searchForm = document.querySelector("#searchForm");
const divider = document.querySelector("#divider");
const savedList = document.querySelector("#savedList");
const resultCol = document.querySelector(".resultCol");
const weatherBox = document.querySelector(".currentWeatherData");
const forecastArea = document.querySelector(".fiveDayForecast");

const weatherData = {};
var savedCities = [];

function onInit() {

    if (localStorage.getItem("Saved Cities")) {
        savedCities = JSON.parse(localStorage.getItem("Saved Cities"));
        showSaved();
    }
}


searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    if (searchBar.value) {
        let cityName = searchBar.value.replace(", ", ",US-");
        searchCity(cityName);
        searchBar.value = "";
    }
    
});

function searchCity(cityName) {
    
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
    apiUrl += cityName;
    apiUrl += "&units=imperial";
    apiUrl += "&appid=";
    apiUrl += apiKey;
    
    fetch(apiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        weatherData.city = data.name;
        weatherData.temp = data.main.temp;
        weatherData.wind = data.wind.speed;
        weatherData.humid = data.main.humidity;
        weatherData.icon = data.weather[0].icon;
        weatherData.desc = data.weather[0].description;
        
        saveCity(weatherData.city);
        
        let urlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=";
        urlTwo += data.coord.lat;
        urlTwo += "&lon=";
        urlTwo += data.coord.lon;
        urlTwo += "&exclude=minutely,hourly,alerts&units=imperial&appid=";
        urlTwo += apiKey;
        
        fetch(urlTwo)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            weatherData.uv = data.current.uvi;
            
            showData(data);
            showSaved();
        })
    })
}

function saveCity(cityName) {

    if (!savedCities.includes(cityName)) {
        savedCities.unshift(cityName);
        localStorage.setItem("Saved Cities", JSON.stringify(savedCities));
        // showSaved();
    }

}

function showSaved() {

    divider.setAttribute("style", "visibility: visible");
    savedList.innerHTML = "";

    for (let city of savedCities) {
        let cityBtn = savedList.appendChild(document.createElement("button"));
        cityBtn.setAttribute("style", "margin-bottom: 5px");
        cityBtn.innerHTML = city;
        console.log(city);
        console.log(weatherData.city);
        if (weatherData.city == city) {
            cityBtn.setAttribute("class", "selectedBtn");
        }
    }

}

function showData(data) {
    // console.log(data);
    resultCol.setAttribute("style", "visibility: visible");
    weatherBox.innerHTML = "";

    weatherBox.appendChild(document.createElement("h2"));
        weatherBox.children[0].innerHTML = `${weatherData.city} ${moment().format("(M/D/YY)")}`;
    
    weatherBox.appendChild(document.createElement("img"));
        weatherBox.children[1].setAttribute("class", "conditionIcon");
        weatherBox.children[1].setAttribute("src", `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`);
        weatherBox.children[1].setAttribute("title", weatherData.desc);

    weatherBox.appendChild(document.createElement("br"));

    weatherBox.appendChild(document.createElement("h3"));
        weatherBox.children[3].innerHTML = `Temp: ${weatherData.temp} °F`;

    weatherBox.appendChild(document.createElement("h3"));
        weatherBox.children[4].innerHTML = `Wind: ${weatherData.wind} MPH`;

    weatherBox.appendChild(document.createElement("h3"));
        weatherBox.children[5].innerHTML = `Humidity: ${weatherData.humid}%`;

    weatherBox.appendChild(document.createElement("h3"));
        weatherBox.children[6].innerHTML = `UV Index: `;
        weatherBox.children[6].appendChild(document.createElement("span"));
        weatherBox.children[6].children[0].setAttribute("class", "uvIndex");
        weatherBox.children[6].children[0].innerHTML = `&nbsp;${weatherData.uv}&nbsp;`;
        if (weatherData.uv <= 2) {
            weatherBox.children[6].children[0].setAttribute("style", "background-color: green");
            weatherBox.children[6].children[0].setAttribute("title", "Low");
        } else if (3 <= weatherData.uv <= 5) {
            weatherBox.children[6].children[0].setAttribute("style", "background-color: yellow; color: black");
            weatherBox.children[6].children[0].setAttribute("title", "Moderate");
        } else if (6 <= weatherData.uv <= 7) {
            weatherBox.children[6].children[0].setAttribute("style", "background-color: orange");
            weatherBox.children[6].children[0].setAttribute("title", "High");
        } else if (8 <= weatherData.uv <= 10) {
            weatherBox.children[6].children[0].setAttribute("style", "background-color: red");
            weatherBox.children[6].children[0].setAttribute("title", "Very High");
        } else if (weatherData.uv >= 11) {
            weatherBox.children[6].children[0].setAttribute("style", "background-color: violet");
            weatherBox.children[6].children[0].setAttribute("title", "Extreme");
        }

    forecastArea.innerHTML = "";

    for (let i = 1; i < 6; i++) {

        let thatDay = data.daily[i];

        let forecastBox = document.createElement("div");
                forecastBox.setAttribute("class", "forecastBox");

            forecastBox.appendChild(document.createElement("h3"));
                forecastBox.children[0].innerHTML = moment(thatDay.dt, "X").format("M/D/YY");

            forecastBox.appendChild(document.createElement("img"));
                forecastBox.children[1].setAttribute("class", "conditionIcon");
                forecastBox.children[1].setAttribute("src", `http://openweathermap.org/img/wn/${thatDay.weather[0].icon}@2x.png`);
                forecastBox.children[1].setAttribute("title", thatDay.weather[0].description);

            forecastBox.appendChild(document.createElement("p"));
                forecastBox.children[2].innerHTML = `Temp: ${thatDay.temp.day} °F`;

            forecastBox.appendChild(document.createElement("p"));
                forecastBox.children[3].innerHTML = `Wind: ${thatDay.wind_speed} MPH`;

            forecastBox.appendChild(document.createElement("p"));
                forecastBox.children[4].innerHTML = `Humidity: ${thatDay.humidity}%`

        forecastArea.appendChild(forecastBox);
    }

}

onInit();