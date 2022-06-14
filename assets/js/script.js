var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var weatherTodayEl = document.querySelector("#weather-today");
var futureForecastEl = document.querySelector("future-forecast");
var cityButtonsEl = document.querySelector("#city-buttons");

const myKey = "e2a5d3faf3cdaf95fb1600353eedf99c";

//get uv index
var displayUV = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + myKey;
    
    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function(data) {
                console.log(data.current.uvi);
                var todayUV = document.createElement("p");
                todayUV.innerHTML = "UV Index: " + data.current.uvi;
                if (data.current.uvi <=2) {
                    todayUV.classList = ".bg-success";
                } else if (data.current.uvi >= 3 && data.current.uvi <= 5) {
                    todayUV.classList = ".bg-warning";
                } else {
                    todayUV.classList = ".bg-danger";
                }
                weatherTodayEl.appendChild(todayUV);
                console.log(todayUV);
            });
        }); 
}

///display weather on page
var displayWeather = function(weather) {
    //current date element
    var today = document.createElement("h3");
    today.innerHTML = weather.name + "(" + moment().format("MMM D, YYYY") + ")";
    weatherTodayEl.appendChild(today);
    
    //today's temp element
    var todayTemp = document.createElement("p");
    todayTemp.innerHTML = "Temp: " + weather.main.temp + "&#176 F";
    // todayTemp.classList = "row";
    weatherTodayEl.appendChild(todayTemp);

    var todayWind = document.createElement("p");
    todayWind.innerHTML = "Wind: " + weather.wind.speed + "MPH";
    // todayWind.classList = "row";
    weatherTodayEl.appendChild(todayWind);

    var todayHumidity = document.createElement("p");
    todayHumidity.innerHTML = "Humidity: " + weather.main.humidity+ "%";
    // todayHumidity.classList = "row";
    weatherTodayEl.appendChild(todayHumidity);

    displayUV(weather.coord.lat, weather.coord.lon);
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
                    displayWeather(data);
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