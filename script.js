// Sample Kanji Data (Add as many as you like here!)
const kanjiList = [
    { kanji: "一", meaning: "One", reading: "On: イチ | Kun: ひと-つ" },
    { kanji: "二", meaning: "Two", reading: "On: ニ | Kun: ふた-つ" },
    { kanji: "三", meaning: "Three", reading: "On: サン | Kun: み-つ" },
    { kanji: "日", meaning: "Day / Sun", reading: "On: ニチ | Kun: ひ" },
    { kanji: "本", meaning: "Book / Origin", reading: "On: ホン | Kun: もと" }
];

let currentIndex = 0;

// DOM Elements
const flashcard = document.getElementById('flashcard');
const kanjiFront = document.getElementById('kanji-front');
const meaningBack = document.getElementById('meaning-back');
const readingBack = document.getElementById('reading-back');

const flipBtn = document.getElementById('flip-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

// Fisher-Yates Shuffle Algorithm to randomize the deck
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Function to update the card display
function updateCard() {
    // Always unflip the card first so the user doesn't accidentally see the back of the next card
    flashcard.classList.remove('flipped');
    
    // Smoothly wait for the flip animation to finish before swapping the text
    setTimeout(() => {
        kanjiFront.innerText = kanjiList[currentIndex].kanji;
        meaningBack.innerText = kanjiList[currentIndex].meaning;
        readingBack.innerText = kanjiList[currentIndex].reading;
    }, 200); 
}

// ==========================================
// INITIALIZATION: Shuffle and load the first card
// ==========================================
shuffleArray(kanjiList);
updateCard();

// ==========================================
// EVENT LISTENERS
// ==========================================

// Flip card on clicking the card itself
flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

// Flip card on clicking the "Flip" button
flipBtn.addEventListener('click', () => flashcard.classList.toggle('flipped'));

// Next Button navigation
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % kanjiList.length;
    updateCard();
});

// Previous Button navigation
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + kanjiList.length) % kanjiList.length;
    updateCard();
});