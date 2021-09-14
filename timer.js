const timerElement = document.getElementById("timer");
const nextIntervalElement = document.getElementById("next-interval");
const toggleButton = document.getElementById("toggle");
const intervalSelect = document.getElementById("interval");
const volumeSlider = document.getElementById("volume-slider");
const volumeLabel = document.getElementById("volume-label");
const soundSelect = document.getElementById("sound-name");

const soundDir = './sounds/';
const sounds = {
  goat: {
    fileName: 'goat.wav',
    label: 'Larry the Goat'
  },
  lion: {
    fileName: 'lion.wav',
    label: 'Lion'
  }
};
for (const sound in sounds) {
  sounds[sound].filePath = `${soundDir}${sounds[sound].fileName}`;
}

const populateSounds = () => {
  let optionsStr = '';
  for (const sound in sounds) {
    optionsStr += `<option value="${sound}">${sounds[sound].label}</option>`
  }
  soundSelect.innerHTML = optionsStr;
}

const colorSchemes = {
  light: {
    '--background-color': '#DEFFFC',
    '--container-color': 'white',
    '--border-color': 'black',
    '--text-color': 'black'
  },
  dark: {
    '--background-color': '#121212',
    '--container-color': '#1e1e1e',
    '--border-color': '#969696',
    '--text-color': '#FFFFFF'
  }
}

// Initialize variables

let intervalID = null;
let isDark = false;
let currentSound;
let targetTime;

// Sound effect functions

const setVolumeLabel = vol => {
  let volStr;
  if (vol > 0) {
    volStr = `${vol * 100}%`;
  } else {
    volStr = 'Muted';
  }
  volumeLabel.innerHTML = volStr;
}

const setVolume = () => {
  const newVol = volumeSlider.value;
  currentSound.volume = newVol;
  setVolumeLabel(newVol);
}

const setSound = () => {
  const soundName = soundSelect.value;
  currentSound = new Audio(sounds[soundName].filePath);
  setVolume();
}

volumeSlider.addEventListener('change', e => {
  setVolume();
});

soundSelect.addEventListener('change', e => {
  setSound();
})

// Color scheme and dark mode

const setColorScheme = (schemeKey) => {
  const scheme = colorSchemes[schemeKey];
  const root = document.documentElement;
  for (const key in scheme) {
    root.style.setProperty(key, scheme[key]);
  }
}

const toggleDarkMode = () => {
  if (isDark) {
    setColorScheme('light');
  } else {
    setColorScheme('dark');
  }
  isDark = !isDark;
}

// Timer logic

const getInterval = () => Number(intervalSelect.value)

const toggleTimer = () => {
  if (intervalID === null) {
    // Timer is not running, start it
    startTimer();
    toggleButton.innerHTML = 'Dash';
  } else {
    // Timer is running, stop it
    stopTimer();
    toggleButton.innerHTML = 'Smash';
  }
}

const resetTimer = () => {
  intervalID = null;
  timerElement.innerHTML = "0:00";
}

// Add event listener to update timer when user changes dropdown
intervalSelect.addEventListener('change', () => {
  setTargetTime();
})

const setTargetTime = () => {
  const now = Date.now();
  const interval = getInterval();
  const intervalMs = interval * 60 * 1000;
  targetTime = now - now % intervalMs + intervalMs;
}

const startTimer = () => {
  setTargetTime();
  intervalID = setInterval(() => {
    const now = Date.now();
    // Check if we have reached target time
    if (now > targetTime) {
      setTargetTime();
      // Play sound
      currentSound.play();
    }
    const timeRemaining = new Date(targetTime - now);
    const minutes = timeRemaining.getMinutes();
    const seconds = String(timeRemaining.getSeconds())
      .padStart(2, '0');
    timerElement.innerHTML = `${minutes}:${seconds}`;
    const targetTimeStr = new Date(targetTime)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    nextIntervalElement.innerHTML = `Next interval: ${targetTimeStr}`;
  }, 1000)
}

const stopTimer = () => {
  clearInterval(intervalID);
  resetTimer();
}

// Initialize defaults
setColorScheme('light');
setVolumeLabel(volumeSlider.value);
populateSounds();
setSound();