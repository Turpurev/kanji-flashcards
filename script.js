let masterKanjiDatabase = []; // Holds all raw entries from json
let activeStudyGroup = [];    // Holds filtered and sliced group selection
let currentIndex = 0;

// DOM Screens (Changed to exact lowercase matching your HTML)
const mainMenu = document.getElementById('main-menu');
const flashcardScreen = document.getElementById('flashcard-screen');

// DOM Card Elements (Changed to exact lowercase matching your HTML)
const flashcard = document.getElementById('flashcard');
const kanjiFront = document.getElementById('kanji-front');
const meaningBack = document.getElementById('meaning-back');
const examplesBack = document.getElementById('examples-back');

// Control Elements (Changed to exact lowercase matching your HTML)
const flipBtn = document.getElementById('flip-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const backBtn = document.getElementById('back-btn');

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Update UI content on flashcard
function updateCard() {
    if (activeStudyGroup.length === 0) return;
    
    flashcard.classList.remove('flipped');
    
    setTimeout(() => {
        const currentItem = activeStudyGroup[currentIndex];
        kanjiFront.innerText = currentItem.kanji;
        
        meaningBack.innerHTML = `
            <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 2px;">
                ${currentItem.meaning} 
                <span style="font-size: 0.9rem; color: #e74c3c; margin-left: 5px;">[${currentItem.level}]</span>
            </div>
            <div style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 8px;">
                ${currentItem.reading}
            </div>
            <hr style="border: 0; height: 1px; background: #555; width: 80%; margin: 8px auto;">
            <div style="font-size: 1.2rem; color: #f1c40f; margin-bottom: 4px; font-weight: 500;">
                ${currentItem.sentence || ''}
            </div>
            <div style="font-size: 0.85rem; color: #bdc3c7; font-style: italic;">
                ${currentItem.translation || ''}
            </div>
        `;
        
        // Render examples
        if (currentItem.examples && currentItem.examples.length > 0) {
            let examplesHTML = '<div style="font-size: 0.9rem; margin-top: 12px; padding-top: 12px; border-top: 1px solid #555;">';
            examplesHTML += '<div style="font-size: 0.8rem; color: #95a5a6; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Examples:</div>';
            
            currentItem.examples.forEach(example => {
                examplesHTML += `
                    <div style="margin-bottom: 10px; padding: 8px; background-color: rgba(255,255,255,0.05); border-radius: 5px;">
                        <div style="font-weight: 500; font-size: 1.1rem; margin-bottom: 3px;">${example.word}</div>
                        <div style="font-size: 0.75rem; color: #a8c5dd; margin-bottom: 3px;">${example.furigana}</div>
                        <div style="font-size: 0.8rem; color: #bdc3c7; font-style: italic;">${example.meaning}</div>
                    </div>
                `;
            });
            
            examplesHTML += '</div>';
            examplesBack.innerHTML = examplesHTML;
        } else {
            examplesBack.innerHTML = '';
        }
    }, 200); 
}

// Core Function called by Main Menu Buttons
function startGroup(level, startIndex, endIndex) {
    // 1. Filter out entries by target level (N5, N4, or N3)
    let filteredByLevel = masterKanjiDatabase.filter(item => item.level === level);
    
    // 2. Select the specified subset array interval range (e.g., 0 to 50)
    activeStudyGroup = filteredByLevel.slice(startIndex, endIndex);
    
    if (activeStudyGroup.length === 0) {
        alert("No kanji available inside this specific index selection.");
        return;
    }
    
    // 3. Shuffle selection subset and start
    shuffleArray(activeStudyGroup);
    currentIndex = 0;
    updateCard();
    
    // 4. Change UI Display screens
    mainMenu.classList.add('style-hidden');
    flashcardScreen.classList.remove('style-hidden');
}

// Return to Main Menu
backBtn.addEventListener('click', () => {
    flashcardScreen.classList.add('style-hidden');
    mainMenu.classList.remove('style-hidden');
});

// Fetch base JSON storage file on background startup load
async function loadKanjiData() {
    try {
        const response = await fetch('kanji.json');
        masterKanjiDatabase = await response.json();
    } catch (error) {
        console.error("Error connecting to Kanji JSON file storage source:", error);
    }
}
loadKanjiData();

// Card Controls
flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
flipBtn.addEventListener('click', () => flashcard.classList.toggle('flipped'));

nextBtn.addEventListener('click', () => {
    if (activeStudyGroup.length > 0) {
        currentIndex = (currentIndex + 1) % activeStudyGroup.length;
        updateCard();
    }
});

prevBtn.addEventListener('click', () => {
    if (activeStudyGroup.length > 0) {
        currentIndex = (currentIndex - 1 + activeStudyGroup.length) % activeStudyGroup.length;
        updateCard();
    }
});
