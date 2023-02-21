var city = 'Newark, NJ';
var lat;
var lon;
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + ',US&limit=1&appid=d08b1379cfe23a7e58b700d18c0903c9', requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result[0]);
        lat = result[0].lat;
        lon = result[0].lon;

        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);

            })
        .catch(error => console.log('error', error));

    })

    .then(function () {

        fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);

            })
        .catch(error => console.log('error', error));
    })
.catch(error => console.log('error', error));





















/*
var time = dayjs().format('MMM DD, YYYY @ h:mm:ss a');
//setInterval(update, 1000);
$('#dateNtime').text(time);
*/
