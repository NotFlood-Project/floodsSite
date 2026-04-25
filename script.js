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
   СУДОКУ ЛОГИКА — ПОЛНАЯ ВЕРСИЯ
   ========================================= */

let sudokuBoard = [];
let sudokuSolution = [];
let sudokuInitial = [];
let sudokuNotes = [];
let sudokuHistory = [];
let sudokuSelected = null;
let sudokuNotesMode = false;
let sudokuInitialized = false;

// Инициализация игры
function initSudoku() {
    generateSudokuPuzzle();
    sudokuHistory = [];
    sudokuSelected = null;
    sudokuNotesMode = false;
    
    const notesBtn = document.getElementById('btn-notes');
    if (notesBtn) {
        notesBtn.classList.remove('active');
        document.getElementById('notes-status').innerText = "Notes OFF";
    }
    
    renderSudokuBoard();
    updateNumpadState();
    sudokuInitialized = true;
}

// Генерация судоку среднего уровня
function generateSudokuPuzzle() {
    // Создаем пустые массивы
    sudokuBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    sudokuSolution = Array(9).fill(null).map(() => Array(9).fill(0));
    sudokuInitial = Array(9).fill(null).map(() => Array(9).fill(0));
    sudokuNotes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => []));
    
    // Заполняем диагональные блоки 3x3
    fillDiagonalBlocks();
    
    // Решаем судоку
    solveSudokuBoard(sudokuBoard);
    
    // Копируем решение
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            sudokuSolution[r][c] = sudokuBoard[r][c];
        }
    }
    
    // Убираем ячейки (средний уровень: 40-50 пустых)
    let cellsToRemove = 45;
    let attempts = 0;
    
    while (cellsToRemove > 0 && attempts < 200) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        
        if (sudokuBoard[r][c] !== 0) {
            sudokuBoard[r][c] = 0;
            cellsToRemove--;
        }
        attempts++;
    }
    
    // Сохраняем начальное состояние
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            sudokuInitial[r][c] = sudokuBoard[r][c];
        }
    }
}

function fillDiagonalBlocks() {
    for (let i = 0; i < 9; i += 3) {
        fillBlock(i, i);
    }
}

function fillBlock(rowStart, colStart) {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);
    
    let idx = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            sudokuBoard[rowStart + i][colStart + j] = nums[idx++];
        }
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function isSafeMove(grid, row, col, num) {
    // Проверка строки
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }
    
    // Проверка столбца
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }
    
    // Проверка блока 3x3
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) return false;
        }
    }
    
    return true;
}

function solveSudokuBoard(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafeMove(grid, row, col, num)) {
                        grid[row][col] = num;
                        
                        if (solveSudokuBoard(grid)) {
                            return true;
                        }
                        
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Отрисовка доски
function renderSudokuBoard() {
    const boardEl = document.getElementById('sudoku-board');
    if (!boardEl) return;
    
    boardEl.innerHTML = '';
    
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            let val = sudokuBoard[r][c];
            
            if (sudokuInitial[r][c] !== 0) {
                // Начальная цифра (неизменяемая)
                cell.innerText = val;
                cell.classList.add('given');
            } else if (val !== 0) {
                // Введенная пользователем цифра
                cell.innerText = val;
                
                // Проверка на ошибку
                if (val !== sudokuSolution[r][c]) {
                    cell.classList.add('error');
                }
            } else if (sudokuNotes[r][c] && sudokuNotes[r][c].length > 0) {
                // Заметки
                let notesGrid = document.createElement('div');
                notesGrid.className = 'sudoku-notes';
                
                for (let i = 1; i <= 9; i++) {
                    let noteEl = document.createElement('div');
                    noteEl.className = 'note-num';
                    if (sudokuNotes[r][c].includes(i)) {
                        noteEl.innerText = i;
                    }
                    notesGrid.appendChild(noteEl);
                }
                
                cell.appendChild(notesGrid);
            }
            
            cell.addEventListener('click', () => selectSudokuCell(r, c));
            boardEl.appendChild(cell);
        }
    }
    
    highlightSudokuCells();
}

// Выбор ячейки
function selectSudokuCell(r, c) {
    sudokuSelected = { r, c };
    highlightSudokuCells();
}

// Подсветка ячеек
function highlightSudokuCells() {
    const cells = document.querySelectorAll('.sudoku-cell');
    
    cells.forEach(cell => {
        cell.classList.remove('selected', 'highlighted', 'same-number');
        
        if (!sudokuSelected) return;
        
        let r = parseInt(cell.dataset.r);
        let c = parseInt(cell.dataset.c);
        let sr = sudokuSelected.r;
        let sc = sudokuSelected.c;
        
        // Выбранная ячейка
        if (r === sr && c === sc) {
            cell.classList.add('selected');
            return;
        }
        
        // Подсветка строки, столбца и блока 3x3
        let sameRow = r === sr;
        let sameCol = c === sc;
        let sameBlock = Math.floor(r / 3) === Math.floor(sr / 3) && 
                        Math.floor(c / 3) === Math.floor(sc / 3);
        
        if (sameRow || sameCol || sameBlock) {
            cell.classList.add('highlighted');
        }
        
        // Подсветка одинаковых цифр
        let selectedVal = sudokuBoard[sr][sc];
        if (selectedVal !== 0 && sudokuBoard[r][c] === selectedVal) {
            cell.classList.add('same-number');
        }
    });
}

// Ввод цифры
function sudokuInput(num) {
    if (!sudokuSelected) return;
    
    let r = sudokuSelected.r;
    let c = sudokuSelected.c;
    
    // Нельзя менять начальные цифры
    if (sudokuInitial[r][c] !== 0) return;
    
    // Сохраняем историю
    saveSudokuHistory();
    
    if (sudokuNotesMode) {
        // Режим заметок
        let notes = sudokuNotes[r][c];
        
        if (notes.includes(num)) {
            sudokuNotes[r][c] = notes.filter(n => n !== num);
        } else {
            sudokuNotes[r][c].push(num);
            sudokuNotes[r][c].sort();
        }
        
        sudokuBoard[r][c] = 0;
    } else {
        // Обычный ввод
        if (sudokuBoard[r][c] === num) {
            sudokuBoard[r][c] = 0;
        } else {
            sudokuBoard[r][c] = num;
            sudokuNotes[r][c] = [];
            
            // Анимация ошибки
            if (num !== sudokuSolution[r][c]) {
                const cell = document.querySelector(`.sudoku-cell[data-r="${r}"][data-c="${c}"]`);
                if (cell) {
                    cell.classList.add('error-flash');
                    setTimeout(() => cell.classList.remove('error-flash'), 300);
                }
            }
            
            // Удаляем эту цифру из заметок в связанных ячейках
            if (num === sudokuSolution[r][c]) {
                removeNoteFromRelated(r, c, num);
            }
        }
    }
    
    renderSudokuBoard();
    updateNumpadState();
    checkSudokuWin();
}

// Удаление заметки из связанных ячеек при правильном вводе
function removeNoteFromRelated(row, col, num) {
    for (let i = 0; i < 9; i++) {
        // Строка
        sudokuNotes[row][i] = sudokuNotes[row][i].filter(n => n !== num);
        // Столбец
        sudokuNotes[i][col] = sudokuNotes[i][col].filter(n => n !== num);
    }
    
    // Блок 3x3
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            sudokuNotes[startRow + i][startCol + j] = 
                sudokuNotes[startRow + i][startCol + j].filter(n => n !== num);
        }
    }
}

// Сохранение истории для отмены
function saveSudokuHistory() {
    sudokuHistory.push({
        board: JSON.parse(JSON.stringify(sudokuBoard)),
        notes: JSON.parse(JSON.stringify(sudokuNotes))
    });
    
    // Ограничиваем историю
    if (sudokuHistory.length > 50) {
        sudokuHistory.shift();
    }
}

// Обновление состояния цифровой панели
function updateNumpadState() {
    const numBtns = document.querySelectorAll('.num-btn');
    
    numBtns.forEach(btn => {
        let num = parseInt(btn.dataset.num);
        let count = 0;
        
        // Считаем сколько раз цифра уже использована правильно
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (sudokuBoard[r][c] === num && sudokuBoard[r][c] === sudokuSolution[r][c]) {
                    count++;
                }
            }
        }
        
        // Если цифра использована 9 раз — она завершена
        if (count >= 9) {
            btn.classList.add('completed');
        } else {
            btn.classList.remove('completed');
        }
    });
}

// Проверка победы
function checkSudokuWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (sudokuBoard[r][c] !== sudokuSolution[r][c]) {
                return false;
            }
        }
    }
    
    // Победа!
    setTimeout(() => {
        alert('Поздравляю! Судоку решено! 🎉');
    }, 100);
    
    return true;
}

// Инициализация обработчиков
document.addEventListener('DOMContentLoaded', () => {
    // Кнопка Notes
    const notesBtn = document.getElementById('btn-notes');
    if (notesBtn) {
        notesBtn.addEventListener('click', function() {
            sudokuNotesMode = !sudokuNotesMode;
            this.classList.toggle('active');
            document.getElementById('notes-status').innerText = 
                sudokuNotesMode ? "Notes ON" : "Notes OFF";
        });
    }
    
    // Кнопка Erase
    const eraseBtn = document.getElementById('btn-erase');
    if (eraseBtn) {
        eraseBtn.addEventListener('click', () => {
            if (!sudokuSelected) return;
            if (sudokuInitial[sudokuSelected.r][sudokuSelected.c] !== 0) return;
            
            saveSudokuHistory();
            sudokuBoard[sudokuSelected.r][sudokuSelected.c] = 0;
            sudokuNotes[sudokuSelected.r][sudokuSelected.c] = [];
            renderSudokuBoard();
            updateNumpadState();
        });
    }
    
    // Кнопка Undo
    const undoBtn = document.getElementById('btn-undo');
    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            if (sudokuHistory.length === 0) return;
            
            let lastState = sudokuHistory.pop();
            sudokuBoard = lastState.board;
            sudokuNotes = lastState.notes;
            renderSudokuBoard();
            updateNumpadState();
        });
    }
    
    // Кнопка Hint
    const hintBtn = document.getElementById('btn-hint');
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            if (!sudokuSelected) return;
            
            let r = sudokuSelected.r;
            let c = sudokuSelected.c;
            
            if (sudokuInitial[r][c] !== 0) return;
            if (sudokuBoard[r][c] === sudokuSolution[r][c]) return;
            
            saveSudokuHistory();
            sudokuBoard[r][c] = sudokuSolution[r][c];
            sudokuNotes[r][c] = [];
            removeNoteFromRelated(r, c, sudokuSolution[r][c]);
            renderSudokuBoard();
            updateNumpadState();
            checkSudokuWin();
        });
    }
    
    // Кнопка новой игры
    const newGameBtn = document.getElementById('btn-new-game');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', initSudoku);
    }
    
    // Цифровая панель
    const numBtns = document.querySelectorAll('.num-btn');
    numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let num = parseInt(btn.dataset.num);
            sudokuInput(num);
        });
    });
});

// Модификация openSection для инициализации судоку
const originalOpenSectionFunc = window.openSection;
window.openSection = function(sectionId) {
    if (typeof originalOpenSectionFunc === 'function') {
        originalOpenSectionFunc(sectionId);
    }
    
    if (sectionId === 'rests' && !sudokuInitialized) {
        setTimeout(() => {
            initSudoku();
        }, 100);
    }
};
