// Переключение вкладок
function openSection(sectionId) {
    // 1. Скрываем все секции
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active-section');
    });

    // 2. Убираем подсветку кнопок
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Показываем нужную секцию
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active-section');
    }

    // 4. Подсвечиваем кнопку
    buttons.forEach(btn => {
        if(btn.getAttribute('onclick').includes(sectionId)) {
            btn.classList.add('active');
        }
    });
}

// Музыкальный плеер
let currentAudio = null;

/* --- УМНЫЙ ПЛЕЕР --- */

// 1. Список песен (Playlist)
// ВАЖНО: Добавляй сюда свои песни. Пути должны быть правильными!
const playlist = [
    {
        title: "Дань Хэн: Scorpions - Still Loving You",
        src: "music/song1.mp3" 
    },
    {
        title: "Блэйд: ...",
        src: "music/song2.mp3" 
    }
    // Можешь добавить еще: { title: "Имя", src: "путь" },
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio(); // Создаем плеер

// Элементы управления из HTML
const titleLabel = document.getElementById('track-title');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');

// Функция: Загрузить песню (по номеру)
function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[index].src;
    titleLabel.innerText = playlist[index].title;
    
    // Сразу включаем
    playSong();
}

// Функция: Играть
function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.innerText = "⏸"; // Значок паузы
}

// Функция: Пауза
function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.innerText = "▶"; // Значок плей
}

// Кнопка Плей/Пауза
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        // Если песня не выбрана, включаем первую
        if (!audio.src) {
            loadTrack(0);
        } else {
            playSong();
        }
    }
}

// Следующая песня
function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex > playlist.length - 1) {
        currentTrackIndex = 0; // Если конец, идем в начало
    }
    loadTrack(currentTrackIndex);
}

// Предыдущая песня
function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = playlist.length - 1;
    }
    loadTrack(currentTrackIndex);
}

// Обновление ползунка времени (каждую секунду)
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress || 0;

    // Обновляем цифры времени 0:00
    let curMins = Math.floor(audio.currentTime / 60);
    let curSecs = Math.floor(audio.currentTime % 60);
    if(curSecs < 10) curSecs = "0" + curSecs;
    currentTimeLabel.innerText = `${curMins}:${curSecs}`;

    let durMins = Math.floor(audio.duration / 60);
    let durSecs = Math.floor(audio.duration % 60);
    if(durSecs < 10) durSecs = "0" + durSecs;
    if(audio.duration) durationLabel.innerText = `${durMins}:${durSecs}`;
});

// Перемотка (когда двигаешь ползунок)
function seekAudio() {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

// Громкость
function setVolume() {
    audio.volume = volumeBar.value;
}