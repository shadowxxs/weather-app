document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    const language = document.getElementById('languageSelect').value;
    if (city) {
        getWeatherData(city, language);
    } else {
        alert('Please enter a city name');
    }
});

function getWeatherData(city, language) {
    const apiKey = 'f1868ba69a3b887f137f7315179f58c7'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data, language);
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
}

function displayWeatherData(data, language) {
    if (data.cod === 200) {
        const weatherData = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;
        document.getElementById('weatherData').innerHTML = weatherData;
        speakWeather(data, language);
    } else {
        document.getElementById('weatherData').innerHTML = `<p>City not found. Please retype the city name.</p>`;
    }
}

function speakWeather(data, language) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = `The weather in ${data.name} is ${data.main.temp} degrees Celsius with ${data.weather[0].description}`;
    msg.lang = language;
    const voices = window.speechSynthesis.getVoices();

    // Filter for a female voice
    let chosenVoice = voices.find(voice => voice.lang === language && voice.name.toLowerCase().includes('female'));

    if (chosenVoice) {
        msg.voice = chosenVoice;
    } else {
        // Fallback to default voice if no female voice is found
        msg.voice = voices.find(voice => voice.lang === language);
    }

    window.speechSynthesis.speak(msg);
}

// Load voices
window.speechSynthesis.onvoiceschanged = function () {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices);
};
