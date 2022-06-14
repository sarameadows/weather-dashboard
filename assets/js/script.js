var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var weatherTodayEl = document.querySelector("#weather-today");
var futureForecastEl = document.querySelector("future-forecast");
var cityButtonsEl = document.querySelector("#city-buttons");

const myKey = "e2a5d3faf3cdaf95fb1600353eedf99c";

///display weather on page
var displayWeather = function() {

}

// get weather from the api url
var getWeather = function(city) {
    //format the url for the particular city in imperial units
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myKey + "&units=imperial";
    console.log(apiUrl);

    //make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            //request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                });
            } else {
                alert("Error: City not found");
            }
        })
        .catch(function(error) {
            alert("Unable to connect")
        });
}

// send city from search bar to getWeather function
var formSubmitHandler = function(event) {
    event.preventDefault();

    //get value from input element
    var selectedCity = cityInputEl.value.trim();

    // if it is a real city get the weather, otherwise display error
    if(selectedCity) {
        getWeather(selectedCity);
        cityInputEl.value = "";
    } else {
        alert("Please enter a valid city");
    }

    console.log(event);
};

// send the city from the featured buttons to the getWeather function
var buttonClickHandler = function(event) {
    var featuredCity = event.target.getAttribute("data-city");

    if (featuredCity) {
        getWeather(featuredCity);
    }
}

cityFormEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", buttonClickHandler);