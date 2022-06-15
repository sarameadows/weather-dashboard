var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var weatherTodayEl = document.querySelector("#weather-today");
var futureForecastCardsEl = document.querySelector("#future-forecast-cards");
var cityButtonsEl = document.querySelector("#city-buttons");
var futureForecastHeadingEl = $("#future-forecast-heading");

const myKey = "e2a5d3faf3cdaf95fb1600353eedf99c";

//get uv index
var displayUV = function(lat, lon) {
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + myKey;
    
    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function(data) {
                var todayUV = document.createElement("p");
                todayUV.innerHTML = "UV Index: " + "<span id=index>" + data.current.uvi + "</span>";
                if (data.current.uvi <=2) {
                    todayUV.classList = "bg-success";
                } else if (data.current.uvi >= 3 && data.current.uvi <= 7) {
                    todayUV.classList = "bg-warning";
                } else {
                    todayUV.classList = "bg-danger";
                }
                weatherTodayEl.appendChild(todayUV);
            });
        }); 
}

///display weather on page
var displayWeather = function(weather) {

    //current date element
    var today = document.createElement("h3");
    today.innerHTML = weather.name + "(" + moment().format("MMM D, YYYY") + ")";
    weatherTodayEl.appendChild(today);

    //get image for forecast
    var icon = document.createElement("img");
    icon.setAttribute("src", "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png")
    weatherTodayEl.appendChild(icon);

    //today's temp element
    var todayTemp = document.createElement("p");
    todayTemp.innerHTML = "Temp: " + weather.main.temp + "&#176 F";
    // todayTemp.classList = "row";
    weatherTodayEl.appendChild(todayTemp);

    var todayWind = document.createElement("p");
    todayWind.innerHTML = "Wind: " + weather.wind.speed + " MPH";
    // todayWind.classList = "row";
    weatherTodayEl.appendChild(todayWind);

    var todayHumidity = document.createElement("p");
    todayHumidity.innerHTML = "Humidity: " + weather.main.humidity+ "%";
    // todayHumidity.classList = "row";
    weatherTodayEl.appendChild(todayHumidity);

    displayUV(weather.coord.lat, weather.coord.lon);
    getFutureForecast(weather.coord.lat, weather.coord.lon);
}

// get weather from the api url
var getWeather = function(city) {
    //format the url for the particular city in imperial units
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myKey + "&units=imperial";

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

var displayFutureForecast = function(forecast) {
    futureForecastHeadingEl.innerHTML = "5-Day Forecast:";
    for (var i=0; i<5; i++){
        var futureDiv = document.createElement("div");
        futureDiv.classList = "card";

        //get date for forecast
        var date = document.createElement("h4");
        date.innerHTML = moment().add(i+1, 'days').format("MM/DD/YYYY");
        futureDiv.appendChild(date);

        //get image for forecast
        var icon = document.createElement("img");
        icon.setAttribute("src", "https://openweathermap.org/img/wn/" + forecast.list[i].weather[0].icon + "@2x.png")
        futureDiv.appendChild(icon);

        //today's temp element
        var futureTemp = document.createElement("p");
        futureTemp.innerHTML = "Temp: " + forecast.list[i].main.temp + "&#176 F";
        futureDiv.appendChild(futureTemp);

        //future temp element
        var futureWind = document.createElement("p");
        futureWind.innerHTML = "Wind: " + forecast.list[i].wind.speed + " MPH";
        futureDiv.appendChild(futureWind);

        //future humidity element
        var futureHumidity = document.createElement("p");
        futureHumidity.innerHTML = "Humidity: " + forecast.list[i].main.humidity+ "%";
        futureDiv.appendChild(futureHumidity);

        console.log(futureDiv.innerHTML);
        futureForecastCardsEl.appendChild(futureDiv);
    }
}

var getFutureForecast = function (lat, lon) {
    //format the url for the particular city in imperial units
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + myKey + "&units=imperial";
    console.log(apiUrl);
    //make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function(data) {
                    displayFutureForecast(data);                
            });
        })
}

// send city from search bar to getWeather function
var formSubmitHandler = function(event) {
    event.preventDefault();

    //get value from input element
    var selectedCity = cityInputEl.value.trim();

    // if it is a real city get the weather, otherwise display error
    if(selectedCity) {
        weatherTodayEl.innerHTML = "";
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