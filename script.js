let kanjiList = [];
let currentIndex = 0;

// DOM Elements
const flashcard = document.getElementById('flashcard');
const kanjiFront = document.getElementById('kanji-front');
const meaningBack = document.getElementById('meaning-back');
const readingBack = document.getElementById('reading-back');

const flipBtn = document.getElementById('flip-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Update card contents on screen
function updateCard() {
    if (kanjiList.length === 0) return;
    
    flashcard.classList.remove('flipped');
    
    setTimeout(() => {
        const currentItem = kanjiList[currentIndex];
        kanjiFront.innerText = currentItem.kanji;
        meaningBack.innerHTML = `${currentItem.meaning} <br><small style="font-size:1rem; color:#e74c3c;">[${currentItem.level}]</small>`;
        readingBack.innerText = currentItem.reading;
    }, 200); 
}

// Fetch data seamlessly from the JSON file
async function loadKanjiData() {
    try {
        const response = await fetch('kanji.json');
        kanjiList = await response.json();
        
        // Shuffle the 300 items instantly
        shuffleArray(kanjiList);
        // Display the first card
        updateCard();
    } catch (error) {
        console.error("Error loading Kanji data file:", error);
        kanjiFront.innerText = "エラー";
    }
}

// Start execution
loadKanjiData();

// Event Listeners
flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
flipBtn.addEventListener('click', () => flashcard.classList.toggle('flipped'));

nextBtn.addEventListener('click', () => {
    if (kanjiList.length > 0) {
        currentIndex = (currentIndex + 1) % kanjiList.length;
        updateCard();
    }
});

prevBtn.addEventListener('click', () => {
    if (kanjiList.length > 0) {
        currentIndex = (currentIndex - 1 + kanjiList.length) % kanjiList.length;
        updateCard();
    }
});
