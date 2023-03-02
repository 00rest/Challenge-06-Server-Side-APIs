let searchInp;
let storedCoordinates = JSON.parse(localStorage.getItem('storedCoordinates'));
let pastSelect = JSON.parse(localStorage.getItem('pastSelect'));
let lat;
let lon;
let cnt = 0;

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

for (let i = 1; i < 6; i++) { //creates 5 future forecast boxes
    let div1 = $('<div>').addClass('col card mx-1 bg-dark');
    let h6 = $('<h6>').addClass('card-header text-info text-center').attr('id', 'h6' + i);
    let div2 = $('<div>').addClass('card-body text-light bg-secondary');
    let sun = $('<img>').attr('id', 'sun' + i);
    let temp = $('<p>').attr('id', 'temp' + i);
    let wind = $('<p>').attr('id', 'wind' + i);
    let hum = $('<p>').attr('id', 'hum' + i);
    div2.append(sun, temp, wind, hum);
    div1.append(h6, div2);
    $('#5dayBody').append(div1);
}

if (pastSelect) { //checks if there is any local data stored
    console.log(pastSelect);
    lat = pastSelect[0].lat;
    lon = pastSelect[0].lon;
    pastSearches();
    getWeather();
} else if (storedCoordinates) {
    stored();
} else { //Default location
    storedCoordinates = [];
    lat = 40.7127281;
    lon = -74.0060152;
    getWeather();
};

function stored() { // retrieves last stored coordinate
    console.log('We doing the stored thing');
    console.log('storedCoordinates result: ');
    console.log(storedCoordinates);
    lat = storedCoordinates[0].lat;
    lon = storedCoordinates[0].lon;

    pastSearches();
    getWeather();
};

$('#searchBtn').on('click', searchNow); // search button listener

function searchNow() { // search new city function
    searchInp = $('#searchInp').val();
    if (searchInp.length) { //checks if we have any input
        console.log('New search for: ' + searchInp);
        cnt = storedCoordinates.length;
        console.log(cnt);
        getCoord();
    }
};

function pastSearches() { //creates past search nuttons
    console.log('Printing past search butons');
    console.log(storedCoordinates.length);
    for (cnt; cnt < storedCoordinates.length; cnt++) {
        let li = $('<li>').addClass('add-project-btn');
        let btn = $('<button>').addClass('btn btn-secondary px-5 py-1 my-1 text-light');
        btn.attr('id', cnt);
        console.log('button ' + cnt + ' created');
        li.append(btn);
        $('#ul-custom').append(li);
        $('#' + cnt).on('click', function () {
            const id = this.id;
            console.log(id);
            lat = storedCoordinates[id].lat;
            lon = storedCoordinates[id].lon;
            console.log(lat);
            console.log(lon);
            getWeather();
        });
    };

    for (let cnt2 = 0; cnt2 < storedCoordinates.length; cnt2++) { $('#' + cnt2).text(storedCoordinates[cnt2].city) };
};

function getCoord() { //searches the city and coordinates
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchInp + ',US&limit=1&appid=d08b1379cfe23a7e58b700d18c0903c9', requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('getCoordinates result: ');
            console.log(result);
            if (result.length < 1) {
                alert('City not found, please try again');
                throw 'No such city name.';
            } else {
                lat = result[0].lat;
                lon = result[0].lon;
                console.log('New city found: ');
                console.log(result[0].name);

                let coordinates = { city: result[0].name, lat: lat, lon: lon };
                storedCoordinates.unshift(coordinates);
                storedCoordinates.splice(8);
                localStorage.setItem('storedCoordinates', JSON.stringify(storedCoordinates));
                console.log('New city and coordinates stored: ');
                console.log(coordinates);
            };
        })
        .then(stored)
        .catch(error => console.log('error', error));
};

function getWeather() { //gets cutrrent and future weather from the API

    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9&units=imperial', requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('getWeather result: ');
            console.log(result);

            $('#cityName').text(result.name + ' (' + dayjs(result.dt * 1000).format('MM/DD/YYYY') + ') ');
            $('#emoji').attr('src', 'http://openweathermap.org/img/w/' + result.weather[0].icon + '.png');
            $('#temp0').text('Temp: ' + result.main.temp + ' ºF');
            $('#wind0').text('Speed: ' + result.wind.speed + ' mph');
            $('#hum0').text('Humidity: ' + result.main.humidity + ' %');
            $('#sunR0').text('Sunrise: ' + new Date(result.sys.sunrise * 1000).toLocaleTimeString());
            $('#sunS0').text('Sunset: ' + new Date(result.sys.sunset * 1000).toLocaleTimeString());


        })
        .then(
            fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9&units=imperial', requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('getWeather result: ');
                    console.log(result);
                    for (var i = 1; i < 6; i++) {
                        var iPlus = (i-1) * 8;
                        $('#h6' + i).text(dayjs(result.list[iPlus].dt_txt).format('MM/DD/YYYY'));
                        $('#sun' + i).attr('src', 'http://openweathermap.org/img/w/' + result.list[iPlus].weather[0].icon + '.png');
                        $('#temp' + i).text('Temp: ' + result.list[iPlus].main.temp + ' ºF');
                        $('#wind' + i).text('Wind: ' + result.list[iPlus].wind.speed + ' mph');
                        $('#hum' + i).text('Humidity: ' + result.list[iPlus].main.humidity + ' %');
                    }
                })
            .catch(error => console.log('error', error))


        )
    .catch(error => console.log('error', error));
};