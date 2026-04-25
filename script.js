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
    { title: "Март 7: Рashasnickers - двигай", src: "music/song4.mp3" },
    { title: "Георгина: Haunted - Beyonce", src: "music/song7.mp3" },
    { title: "Кирена: Mac Miller - Messages from the stars", src: "music/song8.mp3" },
    { title: "Раппа: Radiohead - All I Need", src: "music/song10.mp3" },
    { title: "Галлахер: Blondie - One way or another", src: "music/song11.mp3" },
    { title: "Каослана: Sullivian King - Thrones of blood", src: "music/song12.mp3" }
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



/* =========================================
   СУДОКУ ЛОГИКА
   ========================================= */
let board = [];
let solution = [];
let initialBoard = [];
let notes = [];
let history = [];
let selectedCell = null; // {r, c}
let isNotesMode = false;

function initSudoku() {
    generateSudoku();
    history = [];
    selectedCell = null;
    isNotesMode = false;
    document.getElementById('btn-notes').classList.remove('active');
    document.getElementById('notes-status').innerText = "Notes OFF";
    renderBoard();
}

// Простой генератор (заполняем диагональные блоки, решаем, убираем ячейки)
function generateSudoku() {
    board = Array(9).fill().map(() => Array(9).fill(0));
    solution = Array(9).fill().map(() => Array(9).fill(0));
    initialBoard = Array(9).fill().map(() => Array(9).fill(0));
    notes = Array(9).fill().map(() => Array(9).fill().map(() => []));

    fillDiagonal();
    solveSudoku(board);
    
    // Копируем решение
    for(let r=0; r<9; r++) for(let c=0; c<9; c++) solution[r][c] = board[r][c];

    // Убираем цифры для среднего уровня (около 45 пустых клеток)
    let cellsToRemove = 45;
    while(cellsToRemove > 0) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if(board[r][c] !== 0) {
            board[r][c] = 0;
            cellsToRemove--;
        }
    }

    // Сохраняем начальное состояние
    for(let r=0; r<9; r++) for(let c=0; c<9; c++) initialBoard[r][c] = board[r][c];
}

function fillDiagonal() {
    for(let i=0; i<9; i+=3) fillBox(i, i);
}

function fillBox(rowStart, colStart) {
    let num;
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            do { num = Math.floor(Math.random() * 9) + 1; } 
            while(!isSafe(board, rowStart+i, colStart+j, num));
            board[rowStart+i][colStart+j] = num;
        }
    }
}

function isSafe(grid, row, col, num) {
    for(let x=0; x<9; x++) if(grid[row][x] === num || grid[x][col] === num) return false;
    let startRow = row - row % 3, startCol = col - col % 3;
    for(let i=0; i<3; i++) for(let j=0; j<3; j++) if(grid[i+startRow][j+startCol] === num) return false;
    return true;
}

function solveSudoku(grid) {
    let row = -1, col = -1, isEmpty = true;
    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            if(grid[i][j] === 0) { row = i; col = j; isEmpty = false; break; }
        }
        if(!isEmpty) break;
    }
    if(isEmpty) return true;
    for(let num=1; num<=9; num++) {
        if(isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if(solveSudoku(grid)) return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

// Отрисовка сетки
function renderBoard() {
    const boardEl = document.getElementById('sudoku-board');
    if (!boardEl) return;
    boardEl.innerHTML = '';

    for(let r=0; r<9; r++) {
        for(let c=0; c<9; c++) {
            let cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            let val = board[r][c];
            if(initialBoard[r][c] !== 0) {
                cell.innerText = val;
                cell.classList.add('given');
            } else if(val !== 0) {
                cell.innerText = val;
                if(val !== solution[r][c]) cell.classList.add('error'); // Красная цифра при ошибке
            } else if(notes[r][c].length > 0) {
                // Отрисовка заметок
                let notesGrid = document.createElement('div');
                notesGrid.className = 'sudoku-notes';
                for(let i=1; i<=9; i++) {
                    let n = document.createElement('div');
                    n.className = 'note-num';
                    if(notes[r][c].includes(i)) n.innerText = i;
                    notesGrid.appendChild(n);
                }
                cell.appendChild(notesGrid);
            }

            cell.onclick = () => selectCell(r, c);
            boardEl.appendChild(cell);
        }
    }
    highlightCells();
}

function selectCell(r, c) {
    selectedCell = {r, c};
    highlightCells();
}

function highlightCells() {
    document.querySelectorAll('.sudoku-cell').forEach(cell => {
        cell.classList.remove('selected', 'highlighted', 'same-number');
        let r = parseInt(cell.dataset.r);
        let c = parseInt(cell.dataset.c);
        
        if(!selectedCell) return;

        // Выделение крестом и блоком
        let sr = selectedCell.r, sc = selectedCell.c;
        let selectedVal = board[sr][sc];

        if(r === sr && c === sc) {
            cell.classList.add('selected');
        } else if (r === sr || c === sc || (Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3))) {
            cell.classList.add('highlighted');
        }
        
        // Подсветка таких же цифр по всему полю
        if(selectedVal !== 0 && board[r][c] === selectedVal && !(r===sr && c===sc)) {
            cell.classList.add('same-number');
        }
    });
}

function sudokuInput(num) {
    if(!selectedCell) return;
    let r = selectedCell.r, c = selectedCell.c;
    if(initialBoard[r][c] !== 0) return; // Нельзя менять изначальные цифры

    saveHistory();

    if(isNotesMode) {
        let n = notes[r][c];
        if(n.includes(num)) notes[r][c] = n.filter(x => x !== num);
        else notes[r][c].push(num);
        board[r][c] = 0; // Сбрасываем большую цифру, если пишем заметку
    } else {
        if(board[r][c] === num) board[r][c] = 0; // Повторное нажатие стирает
        else board[r][c] = num;
        notes[r][c] = []; // Очищаем заметки при вводе цифры
    }
    renderBoard();
}

function saveHistory() {
    history.push({
        board: JSON.parse(JSON.stringify(board)),
        notes: JSON.parse(JSON.stringify(notes))
    });
}

// Обработчики кнопок
document.addEventListener('DOMContentLoaded', () => {
    // Вызываем при загрузке (если раздел рестов не скрыт)
    // Но лучше вызывать при открытии раздела 'rests', это учтено ниже.

    document.getElementById('btn-notes')?.addEventListener('click', function() {
        isNotesMode = !isNotesMode;
        this.classList.toggle('active');
        document.getElementById('notes-status').innerText = isNotesMode ? "Notes ON" : "Notes OFF";
    });

    document.getElementById('btn-erase')?.addEventListener('click', () => {
        if(!selectedCell || initialBoard[selectedCell.r][selectedCell.c] !== 0) return;
        saveHistory();
        board[selectedCell.r][selectedCell.c] = 0;
        notes[selectedCell.r][selectedCell.c] = [];
        renderBoard();
    });

    document.getElementById('btn-undo')?.addEventListener('click', () => {
        if(history.length === 0) return;
        let lastState = history.pop();
        board = lastState.board;
        notes = lastState.notes;
        renderBoard();
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
        if(!selectedCell || initialBoard[selectedCell.r][selectedCell.c] !== 0 || board[selectedCell.r][selectedCell.c] === solution[selectedCell.r][selectedCell.c]) return;
        saveHistory();
        board[selectedCell.r][selectedCell.c] = solution[selectedCell.r][selectedCell.c];
        notes[selectedCell.r][selectedCell.c] = [];
        renderBoard();
    });
});

// МОДЕРНИЗАЦИЯ openSection: генерируем судоку при первом заходе в раздел
const originalOpenSection = window.openSection;
window.openSection = function(sectionId) {
    if(typeof originalOpenSection === 'function') originalOpenSection(sectionId);
    
    if(sectionId === 'rests' && board.length === 0) {
        initSudoku();
    }
}