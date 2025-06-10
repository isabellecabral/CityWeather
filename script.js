//require('dotenv').config();

//const apiKey = process.env.API_KEY;
const apiKey ='df205e8245376bc7dbf049579942d259';


let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn');
currentWeatherCard = document.querySelectorAll('.weather-top .card')[0],
    weatherIconCard = document.querySelectorAll('.weather-top .weather-icon')[0],
    detailsCard = document.querySelectorAll('.card-details')[0],
    temphourCard = document.querySelectorAll('.temp-hour .footer-temp-hour')[0],
    SevenDaysForecastCard = document.querySelectorAll('.weather-footer')[0];
NavcityName = document.querySelectorAll('.nav-list')[0];



function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = "";
    if (!cityName) return;
    let GEOCODING_API_URL_ = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(GEOCODING_API_URL_).then(res => res.json()).then(data => {
        let { name, lat, lon, country, state } = data[0];
        getWeatherDetails(cityName, lat, lon, country, state);

    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`)
    })
}


function getWeatherDetails(cityName, lat, lon, country, state) 
{


    //antiga url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    //nova url = api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`,

    //nova url 
    //antiga url https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}

        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
        days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'July',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

        let date = new Date();


        NavcityName.innerHTML = `
        <li>Weather in ${data.name}</li>
            
            `

        weatherIconCard.innerHTML = `
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
            </div>`

        currentWeatherCard.innerHTML = `
          
            <div class="card">
                <div class="current-weather">
                    
                    <div class="details">
                        <h2>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                        <br>
                        <p class="current-temp">${(data.main.temp - 273.15).toFixed(2)}&deg;C</p>
                        <p>${data.weather[0].description}</p>
                    </div> 

                </div>
                <hr>
                <div class="card-footer">
                    <p>feels likes ${(data.main.feels_like - 273.15).toFixed(2)}&deg;C</p>
                </div>
            </div>`

        detailsCard.innerHTML = `
            <div class="card-details">
                <h2>MORE DETAILS</h2>
                <br>
                <br>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p> Air humidity: ${data.main.humidity}%</p>
                <p>Presure: ${data.main.pressure}</p>
                
            </div>
        `


    }).catch(() => {
        alert('Failed to fetch current weather')
    })

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        //console.log(data);

        //FORECAST EM 3 EM 3 HORAS

        let date = new Date().getHours();
        temphourCard.innerHTML = '';
        for (i = 0; i < 7; i++) {

            temphourCard.innerHTML += `
                <div class="card-temp-hour">
                    <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="">
                    <h2>${(data.list[i].main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <br>
                    <p>${data.list[i].dt_txt}</p>
                </div>
                `
        }

        //FORECAST PARA OS PROXIMOS 7 DIAS

        let uniqueForecastDays = [];
        let SevenDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        })
        SevenDaysForecastCard.innerHTML = '';

        for (i = 0; i < SevenDaysForecast.length; i++) {
            let date = new Date(SevenDaysForecast[i].dt_txt)
            SevenDaysForecastCard.innerHTML += `<div class="card-day">
                <h2 class="title-week-temp">${days[date.getDay()]}</h2>
                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                <br>    
                <p>min ${(SevenDaysForecast[i].main.temp_min - 273.13).toFixed(2)}&deg;C</p>
                <p>max ${(SevenDaysForecast[i].main.temp_max - 273.13).toFixed(2)}&deg;C</p>
                <img src="https://openweathermap.org/img/wn/${SevenDaysForecast[i].weather[0].icon}@2x.png" alt="">
            </div>`
        }

        //PROBABILIDADE DE CHOVER NO DIA => CARD MORE DETAILS
        if (data.list[0] && typeof data.list[0].pop === "number") {
            let pop = data.list[0].pop * 100;
            // Adiciona ao conteúdo já existente
            detailsCard.innerHTML += `<p>Precipitation probability: ${pop.toFixed(0)}%</p>`;
        } else {
            detailsCard.innerHTML += `<p>Precipitation probability: N/A</p>`;
        }


    }).catch(() => {
        alert('Failed to fetch current weather')
    })

}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        //console.log(latitude, longitude);
        REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            let { name, country, state } = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert('Failed to fetch current weather')
        })
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation permission denied')
        }
    })
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates())
window.addEventListener('load', getUserCoordinates)