/* =================================================================
   ГЛАВНЫЙ МОЗГ САЙТА (ИСПРАВЛЕННЫЙ И НАДЕЖНЫЙ)
   ================================================================= */

// Эта функция работает и если кнопка просит showSection, и openSection
function showSection(sectionId) {
    console.log("Пытаюсь открыть раздел: " + sectionId);

    // 1. Ищем раздел в HTML по ID
    const targetSection = document.getElementById(sectionId);

    // Если раздела нет — не ломаем сайт, а просто сообщаем и выходим
    if (!targetSection) {
        console.error("ОШИБКА: Раздел с ID '" + sectionId + "' не найден!");
        alert("Ошибка! Проверь, правильно ли написан ID в HTML: " + sectionId);
        return;
    }

    // 2. Скрываем ВСЕ разделы
    const allSections = document.querySelectorAll('.page-section');
    allSections.forEach(section => {
        section.style.display = 'none'; // Прячем
        section.classList.remove('active-section'); // Убираем класс активности
    });

    // 3. Показываем НУЖНЫЙ раздел
    targetSection.style.display = 'block'; 
    // Маленькая задержка для плавности (чтобы CSS успел подхватить)
    setTimeout(() => {
        targetSection.classList.add('active-section');
    }, 10);

    // 4. Прокручиваем страницу вверх
    window.scrollTo(0, 0);

    // 5. Управление кнопками меню (подсветка)
    const allButtons = document.querySelectorAll('.nav-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
        // Если кнопка ведет на этот раздел — подсвечиваем её
        if (btn.getAttribute('onclick').includes(sectionId)) {
            btn.classList.add('active');
        }
    });

    // 6. Закрываем мобильное меню (если оно открыто)
    const sidebar = document.querySelector('.sidebar');
    const burger = document.getElementById('burger-btn');
    if (sidebar) {
        sidebar.classList.remove('active');
        if (burger) burger.textContent = '☰';
    }
}

// --- ЗАПАСНОЙ ВХОД (Для совместимости со старыми кнопками) ---
// Если в HTML где-то осталось openSection, оно перенаправит сюда
function openSection(id) {
    showSection(id);
}

/* =================================================================
   МУЗЫКАЛЬНЫЙ ПЛЕЕР (ЧТОБЫ МУЗЫКА ИГРАЛА)
   ================================================================= */
let currentAudio = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;

const playlist = [
    { title: "Дань Хэн: Scorpions - Still Loving You", src: "music/song1.mp3" },
    { title: "Миша: Radiohead - Climbing Up The Walls", src: "music/song2.mp3" },
    { title: "Яоши: Монеточка - птичка", src: "music/song3.mp3" },
    { title: "Март 7: Рashasnickers - двигай", src: "music/song4.mp3" }
];

function loadTrack(index) {
    if (index >= playlist.length) index = 0;
    if (index < 0) index = playlist.length - 1;
    
    currentTrackIndex = index;
    currentAudio.src = playlist[index].src;
    
    const titleLabel = document.getElementById('track-title');
    if (titleLabel) titleLabel.innerText = playlist[index].title;
    
    playSong();
}

function playSong() {
    currentAudio.play();
    isPlaying = true;
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.innerText = "⏸";
}

function togglePlay() {
    if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
        document.getElementById('play-btn').innerText = "▶";
    } else {
        if (!currentAudio.src && playlist.length > 0) loadTrack(0);
        else playSong();
    }
}

function nextTrack() { loadTrack(currentTrackIndex + 1); }
function prevTrack() { loadTrack(currentTrackIndex - 1); }

/* =================================================================
   МОБИЛЬНОЕ МЕНЮ
   ================================================================= */
function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const burger = document.getElementById('burger-btn');
    if (sidebar) {
        sidebar.classList.toggle('active');
        if (burger) {
            burger.textContent = sidebar.classList.contains('active') ? '✕' : '☰';
        }
    }
}

/* =================================================================
   ЗАПУСК ПРИ ВХОДЕ (САМОЕ ВАЖНОЕ!)
   ================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Пытаемся открыть раздел 'welcome' (Главная)
    const welcome = document.getElementById('welcome');
    if (welcome) {
        showSection('welcome');
    } else {
        // Если 'welcome' не нашли, открываем самый первый раздел, который есть
        const firstSection = document.querySelector('.page-section');
        if (firstSection) {
            showSection(firstSection.id);
        }
    }
});