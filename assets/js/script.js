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

for (let i = 1; i < 6; i++) {
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

if (pastSelect) {
    console.log(pastSelect);
    lat = pastSelect[0].lat;
    lon = pastSelect[0].lon;
    pastSearches();
    getWeather();
} else if (storedCoordinates) {
    stored();
} else {
    storedCoordinates = [];
    lat = 40.7127281;
    lon = -74.0060152;
    getWeather();
};

function stored() {
    console.log('We doing the stored thing');
    console.log('storedCoordinates result: ');
    console.log(storedCoordinates);
    lat = storedCoordinates[0].lat;
    lon = storedCoordinates[0].lon;

    pastSearches();
    getWeather();
};

$('#searchBtn').on('click', searchNow);

function searchNow() {
    searchInp = $('#searchInp').val();
    if (searchInp.length) {
        console.log('New search for: ' + searchInp);
        cnt = storedCoordinates.length;
        console.log(cnt);
        getCoord();
    }
};

function pastSearches() {
    console.log('Printing past search butons');
    console.log(storedCoordinates.length);
    for (cnt; cnt < storedCoordinates.length; cnt++) {
        let li = $('<li>').addClass('add-project-btn');
        let btn = $('<button>').addClass('btn btn-secondary px-5 py-1 my-1 text-light');
        btn.attr('id', 'btn' + cnt);
        console.log('button '+cnt+' created');
        btn.text(storedCoordinates[cnt].city);
        li.append(btn);
        $('#ul-custom').append(li);
        $('#btn' + cnt).on('click', function(){
            console.log('im pressing a button'+cnt);

            lat = storedCoordinates[cnt].lat;
            lon = storedCoordinates[cnt].lon;
            getWeather();
        });
    };

    
};

function getCoord() {
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
                storedCoordinates.splice(5);
                localStorage.setItem('storedCoordinates', JSON.stringify(storedCoordinates));
                console.log('New city and coordinates stored: ');
                console.log(coordinates);
            };
        })
        .then(stored)
        .catch(error => console.log('error', error));
};

function getWeather() {
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9&units=imperial', requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('getWeather result: ');
            console.log(result);

            $('#cityName').text(result.city.name + ' (' + dayjs(result.list[0].dt_txt).format('MM/DD/YYYY') + ') ');
            $('#emoji').attr('src', 'http://openweathermap.org/img/w/' + result.list[0].weather[0].icon + '.png');
            $('#temp0').text('Temp: ' + result.list[0].main.temp + ' ºF');
            $('#wind0').text('Speed: ' + result.list[0].wind.speed + ' mph');
            $('#hum0').text('Humidity: ' + result.list[0].main.humidity + ' %');
            $('#sunR0').text('Sunrise: ' + new Date(result.city.sunrise * 1000).toLocaleTimeString());
            $('#sunS0').text('Sunset: ' + new Date(result.city.sunset * 1000).toLocaleTimeString());

            for (var i = 1; i < 6; i++) {
                $('#h6' + i).text(dayjs(result.list[i * 8 - 1].dt_txt).format('MM/DD/YYYY'));
                $('#sun' + i).attr('src', 'http://openweathermap.org/img/w/' + result.list[i * 8 - 1].weather[0].icon + '.png');
                $('#temp' + i).text('Temp: ' + result.list[i * 8 - 1].main.temp + ' ºF');
                $('#wind' + i).text('Wind: ' + result.list[i * 8 - 1].wind.speed + ' mph');
                $('#hum' + i).text('Humidity: ' + result.list[i * 8 - 1].main.humidity + ' %');
            }
        })
        .catch(error => console.log('error', error));
};