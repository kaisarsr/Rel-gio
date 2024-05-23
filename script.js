const clockElement = document.getElementById('clock');
const alarmTimeInput = document.getElementById('alarm-time');
const alarmMessageInput = document.getElementById('alarm-message');
const customImageInput = document.getElementById('custom-image');
const customSoundInput = document.getElementById('custom-sound');
const alarmSound = document.getElementById('alarm-sound');
const alarmsList = document.getElementById('alarms-list');
const notification = document.getElementById('notification');
const alarmImageDisplay = document.getElementById('alarm-image-display');
const stopAlarmButton = document.getElementById('stop-alarm-button');
const alarmColorInput = document.getElementById('alarm-color'); // Corrigido para corresponder ao ID do elemento

let alarms = [];
let clockInterval;
let alarmTimeout;

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function setAlarm() {
    const time = alarmTimeInput.value;
    const message = alarmMessageInput.value;
    const image = customImageInput.files[0];
    const color = alarmColorInput.value;

    if (time && message && image) {
        alarms.push({ time, message, image, color});
        renderAlarms();
    
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

function renderAlarms() {
    alarmsList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const alarmItem = document.createElement('div');
        alarmItem.classList.add('alarm-item');
        alarmItem.innerHTML = `
            <span>${alarm.time} - ${alarm.message}</span>
            <button onclick="removeAlarm(${index})"><i class="fas fa-trash"></i></button>
        `;
        alarmsList.appendChild(alarmItem);
    });
}

function removeAlarm(index) {
    alarms.splice(index, 1);
    renderAlarms();
}

function triggerAlarm(message, image, color) {
    const customSound = customSoundInput.files[0];
    if (customSound) {
        const soundUrl = URL.createObjectURL(customSound);
        alarmSound.src = soundUrl;
    }
    alarmSound.play();
    document.body.classList.add('flash');
    document.body.style.backgroundColor = color; // Aplica a cor selecionada ao fundo da página
    showNotification(message);

    if (image) {
        const img = document.createElement('img');
        const imageUrl = URL.createObjectURL(image);
        img.src = imageUrl;
        alarmImageDisplay.innerHTML = '';
        alarmImageDisplay.appendChild(img);
        alarmImageDisplay.appendChild(stopAlarmButton); // Append stop button
        alarmImageDisplay.style.display = 'flex';
    }

    alarmTimeout = setTimeout(() => {
        stopAlarm();
    }, 60000);
}


function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function stopAlarm() {
    clearTimeout(alarmTimeout);
    document.body.classList.remove('flash');
    alarmSound.pause();
    alarmSound.currentTime = 0;
    document.body.style.backgroundColor = ''; // Resetar a cor de fundo
    alarmImageDisplay.style.display = 'none';
    alarmImageDisplay.innerHTML = '';
}

function checkAlarms() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    alarms.forEach(alarm => {
        if (alarm.time + ':00' === currentTime) {  // Include seconds for precise matching
            triggerAlarm(alarm.message, alarm.image, alarm.color);
        }
    });
}

clockInterval = setInterval(updateClock, 1000);
setInterval(checkAlarms, 1000);  // Check every second

updateClock();