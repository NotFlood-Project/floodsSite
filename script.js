/* === УНИВЕРСАЛЬНОЕ ПЕРЕКЛЮЧЕНИЕ РАЗДЕЛОВ === */
function showSection(sectionId) {
    // 1. Проверяем, существует ли раздел
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) {
        console.error('Ошибка: Раздел с ID "' + sectionId + '" не найден в HTML');
        return;
    }

    // 2. Скрываем все разделы
    const allSections = document.querySelectorAll('.page-section');
    allSections.forEach(section => {
        section.classList.remove('active-section');
        section.style.display = 'none';
    });

    // 3. Показываем нужный раздел
    targetSection.style.display = 'block';
    setTimeout(() => {
        targetSection.classList.add('active-section');
    }, 10);

    // 4. Подсвечиваем кнопку в меню
    const allButtons = document.querySelectorAll('.nav-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
        // Проверяем, ведет ли кнопка на этот раздел
        if(btn.getAttribute('onclick').includes(sectionId)) {
            btn.classList.add('active');
        }
    });

    // 5. Прокручиваем страницу вверх
    window.scrollTo(0, 0);

    // 6. Если это телефон — закрываем шторку меню
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        toggleMenu();
    }
}

/* === МУЗЫКАЛЬНЫЙ ПЛЕЕР === */
let currentAudio = null;
const playlist = [
    { title: "Дань Хэн: Scorpions - Still Loving You", src: "music/song1.mp3" },
    { title: "Миша: Radiohead - Climbing Up The Walls", src: "music/song2.mp3" },
    { title: "Яоши: Монеточка - птичка", src: "music/song3.mp3" },
    { title: "Март 7: Рashasnickers - двигай", src: "music/song4.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Элементы плеера
const titleLabel = document.getElementById('track-title');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[index].src;
    titleLabel.innerText = playlist[index].title;
    playSong();
}

function playSong() {
    audio.play();
    isPlaying = true;
    if(playBtn) playBtn.innerText = "⏸";
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    if(playBtn) playBtn.innerText = "▶";
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        if (!audio.src) loadTrack(0);
        else playSong();
    }
}

function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex > playlist.length - 1) currentTrackIndex = 0;
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;
    loadTrack(currentTrackIndex);
}

// Обновление прогресс-бара
audio.addEventListener('timeupdate', () => {
    if(progressBar) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress || 0;
    }
    
    // Время
    if(currentTimeLabel) {
        let curMins = Math.floor(audio.currentTime / 60);
        let curSecs = Math.floor(audio.currentTime % 60);
        if(curSecs < 10) curSecs = "0" + curSecs;
        currentTimeLabel.innerText = `${curMins}:${curSecs}`;
    }

    if(durationLabel && audio.duration) {
        let durMins = Math.floor(audio.duration / 60);
        let durSecs = Math.floor(audio.duration % 60);
        if(durSecs < 10) durSecs = "0" + durSecs;
        durationLabel.innerText = `${durMins}:${durSecs}`;
    }
});

function seekAudio() {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

function setVolume() {
    if(volumeBar) audio.volume = volumeBar.value;
}

/* === МОБИЛЬНОЕ МЕНЮ (ШТОРКА) === */
function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const burger = document.getElementById('burger-btn');
    
    if(sidebar) {
        sidebar.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            if(burger) burger.textContent = '✕';
        } else {
            if(burger) burger.textContent = '☰';
        }
    }
}

/* === ЗАПУСК ПРИ ВХОДЕ === */
document.addEventListener('DOMContentLoaded', () => {
    // Открываем главную страницу сразу
    showSection('welcome');
});