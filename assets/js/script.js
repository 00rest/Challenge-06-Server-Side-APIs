var city = 'New York, NY';
var storedCities = [];
let stored = localStorage.getItem('storedCity');
var lat;
var lon;
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

for (var i = 1; i < 6; i++) {
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

function getWeather() {
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + ',US&limit=1&appid=d08b1379cfe23a7e58b700d18c0903c9', requestOptions)
        .then(response => response.json())
        .then(result => {
            lat = result[0].lat;
            lon = result[0].lon;
        })
        .then(function () {

            fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9&units=imperial', requestOptions)
                .then(response => response.json())
                .then(result => {
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
        })
    .catch(error => console.log('error', error));
};

if (stored) {
    console.log('We doing the stored thing');
    city = stored;
    console.log(city);
    pastSearches()
};

getWeather();

$('#searchBtn').on('click', function () {
    let searchInp = $('#searchInp').val();
    localStorage.setItem('storedCity', searchInp);
    city = searchInp;
    console.log('New search for: '+city);
    getWeather();
    pastSearches();
});


function pastSearches(){
    console.log('Printing past search butons');
};



















/*
var time = dayjs().format('MMM DD, YYYY @ h:mm:ss a');
//setInterval(update, 1000);
$('#dateNtime').text(time);
*/
