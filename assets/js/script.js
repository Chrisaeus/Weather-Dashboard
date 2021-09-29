const apiKey = "3b64edad468d56e62a18ce53bbd20378";

const searchCol = document.querySelector("#searchCol");
const searchBar = document.querySelector("#searchBar");
const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let cityName = searchBar.value.replace(", ", ",US-");
    searchCity(cityName);
    searchBar.value = "";

});

function searchCity(cityName) {
    let apiUrl = "api.openweathermap.org/data/2.5/weather?q=";
    apiUrl += cityName;
    apiUrl += "&appid="
    apiUrl += apiKey;

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}