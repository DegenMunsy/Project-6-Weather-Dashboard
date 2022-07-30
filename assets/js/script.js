var inputSearch = document.querySelector("#city-search")
var button = document.querySelector("#search-weather")
var container = document.querySelector("#container")
var forecastWeather = document.querySelector("#forecast-weather")
var currentDay = moment().format('dddd, MMMM Do, YYYY')
console.log(currentDay)


var savedContainer = document.querySelector('.savedContainer')
getCurrentHistory()

function getCity(e) {
    e.preventDefault()
    var cityName = inputSearch.value
    fetchData(cityName)
    createHistory(cityName)
}

function getCurrentHistory() {
    var storage = JSON.parse(localStorage.getItem('savedCities'))
    if (storage === null) {
        storage = []
    }
    for (var i = 0; i < storage.length; i++) {
        var savedLi = document.createElement('button')
        savedLi.textContent = storage[i]
        savedLi.setAttribute('id', storage[i])
        savedContainer.prepend(savedLi)
        savedLi.addEventListener('click', function (event) {
            var clickedCity = event.target.id
            fetchData(clickedCity)
        })
    }
}

function createHistory() {
    var searchedCity = inputSearch.value
    savedContainer.textContent = ""
    if (searchedCity === "") {
        alert("You must type a city")
        getCurrentHistory()
        return
    }
    var storage = JSON.parse(localStorage.getItem('savedCities'))
    if (storage === null) {
        storage = []
    }
    storage.push(searchedCity)
    localStorage.setItem('savedCities', JSON.stringify(storage))
    for (var i = 0; i < storage.length; i++) {
        var savedLi = document.createElement('button')
        savedLi.textContent = storage[i]
        savedLi.setAttribute('id', storage[i])
        savedContainer.prepend(savedLi)
        savedLi.addEventListener('click', function (event) {
            var clickedCity = event.target.id
            fetchData(clickedCity)
        })
    }

}

function fetchData(city) {
    var apiKey = "f1611a0b84f85cc9e5f1379f2e0b2a7e"
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey
    container.innerHTML = ""
    forecastWeather.innerHTML = ""

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {

            console.log(weatherData);
            var cityName = document.createElement("h2");
            var cityTemp = document.createElement("h2");
            var wind = document.createElement("h2");
            var humidity = document.createElement("h2");
            var iconValue = weatherData.weather[0].icon;
            var icon = "http://openweathermap.org/img/wn/" + iconValue + ".png"

            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;


            cityName.textContent = weatherData.name + " (" + currentDay + ")"
            container.append(cityName);

            cityTemp.textContent = "Temp: " + Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32) + "\xB0" + "F";
            container.append(cityTemp);

            wind.textContent = "Wind: " + weatherData.wind.speed + " Mph";
            container.append(wind);

            humidity.textContent = "Humidity: " + weatherData.main.humidity + "%"
            container.append(humidity)        

            var requestUv = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=f30dc0b71f772a037a522282770190be";
            fetch(requestUv)
                .then(function (response) {
                    return response.json();
                })
                .then(function (uvData) {
                    console.log(uvData)
                    var uv = document.createElement("h2")
                    uv.textContent = "UV Index: " + uvData.current.uvi
                    if (uvData.current.uvi < 2) {
                        uv.classList.add("uvlow");
                    }
                    else if (uvData.current.uvi > 2 && uvData.current.uvi < 5) {
                        uv.classList.add("uvmoderate")
                    }
                    else if (uvData.current.uvi > 5 && uvData.current.uvi < 7) {
                        uv.classList.add("uvhigh")
                    }
                    else if (uvData.current.uvi > 7 && uvData.current.uvi < 10) {
                        uv.classList.add("uvhigh2")
                    }
                    else if (10 < uvData.current.uvi) {
                        uv.classList.add("uvextreme")
                    }
                    container.append(uv);


                    for (var i = 1; i < 6; i++) {


                        var fiveDay = document.createElement("div")


                        var fiveDayDate = document.createElement('h4')
                        fiveDayDate.textContent = moment().add(i, 'days').format('dddd, MMMM Do')
                        fiveDay.append(fiveDayDate)

                        fiveDay.setAttribute("class", "card")
                        var fiveDaytemp = document.createElement("h5")
                        fiveDaytemp.textContent = "Temp: " + Math.round((uvData.daily[i].temp.day - 273.15) * 9 / 5 + 32) + "\xB0" + "F"
                        fiveDay.append(fiveDaytemp)
                        forecastWeather.append(fiveDay)


                        var iconValue = uvData.daily[i].weather[0].icon;
                        var icon = "http://openweathermap.org/img/wn/" + iconValue + ".png"
                        var fiveDayIcon = document.createElement("IMG");
                        fiveDayIcon.setAttribute("src", icon);
                        fiveDayIcon.classList.add("resize")
                        fiveDay.append(fiveDayIcon);

                        var fiveDayWind = document.createElement("h5")
                        fiveDayWind.textContent = "Wind: " + uvData.daily[i].wind_speed + "MPH"
                        fiveDay.append(fiveDayWind)


                        var fiveDayHumidity = document.createElement("h5")
                        fiveDayHumidity.textContent = "Humidity: " + uvData.daily[i].humidity + "%"
                        fiveDay.append(fiveDayHumidity)
                    }


                    myFunction()
                    function myFunction() {
                        var x = document.createElement("IMG");
                        x.setAttribute("src", icon);
                        cityName.append(x);


                    }
                    renderBorder()
                    function renderBorder() {
                        container.classList.add("container")

                        inputSearch.value = ""
                    }


                })

        })

}

button.addEventListener("click", getCity)