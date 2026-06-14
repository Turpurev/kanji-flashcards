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
        
        // Front of the card
        kanjiFront.innerText = currentItem.kanji;
        
        // Back of the card (Includes expanded HTML formatting for layout)
        meaningBack.innerHTML = `
            <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 2px;">
                ${currentItem.meaning} 
                <span style="font-size: 0.9rem; color: #e74c3c; margin-left: 5px;">[${currentItem.level}]</span>
            </div>
            
            <hr style="border: 0; height: 1px; background: #555; width: 80%; margin: 8px auto;">
            
            <div style="font-size: 1.1rem; color: #f1c40f; margin-bottom: 4px; font-weight: 500;">
                ${currentItem.sentence || 'No sentence available'}
            </div>
            
            <div style="font-size: 0.85rem; color: #bdc3c7; font-style: italic; margin-bottom: 8px;">
                ${currentItem.translation || ''}
            </div>
        `;
        
        // Base reading line at the bottom
        readingBack.innerText = currentItem.reading;
    }, 200); 
}

// Fetch data seamlessly from the JSON file
async function loadKanjiData() {
    try {
        const response = await fetch('kanji.json');
        kanjiList = await response.json();
        
        // Shuffle everything instantly
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
});let kanjiList = [];
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
        
        // Front of the card
        kanjiFront.innerText = currentItem.kanji;
        
        // Back of the card (Includes expanded HTML formatting for layout)
        meaningBack.innerHTML = `
            <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 2px;">
                ${currentItem.meaning} 
                <span style="font-size: 0.9rem; color: #e74c3c; margin-left: 5px;">[${currentItem.level}]</span>
            </div>
            
            <hr style="border: 0; height: 1px; background: #555; width: 80%; margin: 8px auto;">
            
            <div style="font-size: 1.1rem; color: #f1c40f; margin-bottom: 4px; font-weight: 500;">
                ${currentItem.sentence || 'No sentence available'}
            </div>
            
            <div style="font-size: 0.85rem; color: #bdc3c7; font-style: italic; margin-bottom: 8px;">
                ${currentItem.translation || ''}
            </div>
        `;
        
        // Base reading line at the bottom
        readingBack.innerText = currentItem.reading;
    }, 200); 
}

// Fetch data seamlessly from the JSON file
async function loadKanjiData() {
    try {
        const response = await fetch('kanji.json');
        kanjiList = await response.json();
        
        // Shuffle everything instantly
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
