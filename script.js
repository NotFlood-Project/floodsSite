/* =========================================
   ГЛАВНЫЙ СКРИПТ (ФУНКЦИЯ openSection)
   ========================================= */

function openSection(sectionId) {
    console.log("Открываю раздел: " + sectionId);

    // 1. Скрываем все секции
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.style.display = 'none'; // Скрываем наверняка
    });

    // 2. Убираем подсветку у кнопок
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Ищем и показываем нужный раздел
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        // Магия для анимации
        setTimeout(() => {
            target.classList.add('active-section');
        }, 10);
        
        // ВАЖНО: Прокручиваем вверх, чтобы видеть начало текста
        window.scrollTo(0, 0);
    } else {
        alert("Ошибка! Раздел с ID '" + sectionId + "' не найден в HTML.");
    }

    // 4. Подсвечиваем нажатую кнопку
    buttons.forEach(btn => {
        if(btn.getAttribute('onclick').includes(sectionId)) {
            btn.classList.add('active');
        }
    });

    // 5. Закрываем шторку (для телефонов)
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        toggleMenu();
    }
}

/* =========================================
   МУЗЫКАЛЬНЫЙ ПЛЕЕР
   ========================================= */
const playlist = [
    { title: "Дань Хэн: Scorpions - Still Loving You", src: "music/song1.mp3" },
    { title: "Миша: Radiohead - Climbing Up The Walls", src: "music/song2.mp3" },
    { title: "Яоши: Монеточка - птичка", src: "music/song3.mp3" },
    { title: "Март 7: Рashasnickers - двигай", src: "music/song4.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

const titleLabel = document.getElementById('track-title');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[index].src;
    if(titleLabel) titleLabel.innerText = playlist[index].title;
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
        if (!audio.src && playlist.length > 0) loadTrack(0);
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

// Обновление времени
audio.addEventListener('timeupdate', () => {
    if(progressBar) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress || 0;
    }
    
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
    if(progressBar) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
}

function setVolume() {
    if(volumeBar) audio.volume = volumeBar.value;
}

/* =========================================
   МОБИЛЬНОЕ МЕНЮ (ШТОРКА)
   ========================================= */
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

// Этот запасной вариант нужен, чтобы кнопки закрывали меню
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Мы уже закрываем меню в openSection, но это для подстраховки
    });
});

// ЗАПУСК ПРИ ВХОДЕ
document.addEventListener('DOMContentLoaded', () => {
    // Открываем главную страницу сразу
    openSection('welcome');
});