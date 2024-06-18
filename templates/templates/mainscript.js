document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3275a43e6f4746c4820185606241006';
    const location = 'Guwahati';
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const weatherDiv = document.getElementById('weather');
            weatherDiv.innerHTML = `
                <h2>${data.location.name}, ${data.location.region}</h2>
                <div class="weather-mainblock">
                    <img src="${data.current.condition.icon}" class="weather-mainblock-grid" id="weather-icon">
                    <div class="weather-mainblock-grid">
                        <div style="position: relative; top:40px;">Temperature: ${data.current.temp_c}°C</div>
                        <div style="position: relative; top:40px;">Last Updated: ${data.current.last_updated}</div>
                    </div>
                </div>
                <div class="weather-subblock">
                    <div class="weather-subblock-grid">Condition: ${data.current.condition.text}</div>
                    <div class="weather-subblock-grid">Humidity: ${data.current.humidity}%</div>
                    <div class="weather-subblock-grid">Feels Like: ${data.current.feelslike_c}°C</div>
                    <div class="weather-subblock-grid">Air Quality Index: ${data.current.air_quality.pm2_5.toFixed(2)}</div>
                </div>
            `;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            const weatherDiv = document.getElementById('weather');
            weatherDiv.innerHTML = `<p>Failed to fetch weather data: ${error.message}</p>`;
        });
});

function predictor() {
    const form = document.getElementById('predict-form');
    const formData = new FormData(form);

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const predictionDiv = document.getElementById('prediction-result');
        if (data.error) {
            predictionDiv.innerHTML = `<p>${data.error}</p>`;
        } else {
            predictionDiv.innerHTML = `<p>Precipitation on ${data.date}: ${data.precipitation}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const predictionDiv = document.getElementById('prediction-result');
        predictionDiv.innerHTML = `<p>Failed to get prediction: ${error.message}</p>`;
    });
}
