let masterKanjiDatabase = []; // Holds all raw entries from json
let compoundDatabase = {};    // Holds compound words grouped by level
let activeStudyGroup = [];    // Holds filtered and sliced group selection
let currentIndex = 0;
let selectedLevel = '';
let isCompoundGroup = false;

// DOM Screens (Changed to exact lowercase matching your HTML)
const mainMenu = document.getElementById('main-menu');
const subMenu = document.getElementById('sub-menu');
const flashcardScreen = document.getElementById('flashcard-screen');
const subMenuTitle = document.getElementById('sub-menu-title');

// DOM Card Elements (Changed to exact lowercase matching your HTML)
const flashcard = document.getElementById('flashcard');
const kanjiFront = document.getElementById('kanji-front');
const meaningBack = document.getElementById('meaning-back');
const examplesBack = document.getElementById('examples-back');

// Control Elements (Changed to exact lowercase matching your HTML)
const backBtn = document.getElementById('back-btn');
const levelBackBtn = document.getElementById('level-back-btn');

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
        flashcard.classList.toggle('compound-card', isCompoundGroup);
        kanjiFront.innerText = currentItem.kanji;

        if (isCompoundGroup) {
            meaningBack.innerHTML = `
                <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 2px;">
                    ${currentItem.meaning}
                    <span style="font-size: 0.9rem; color: #e74c3c; margin-left: 5px;">[${currentItem.level}]</span>
                </div>
                <div style="font-size: 0.9rem; color: #bdc3c7; margin-bottom: 8px;">
                    ${currentItem.reading}
                </div>
            `;
            examplesBack.classList.add('style-hidden');
            examplesBack.innerHTML = '';
            return;
        }

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
            examplesBack.classList.remove('style-hidden');
            let examplesHTML = '<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #555;">';
            examplesHTML += '<div style="font-size: 0.8rem; color: #95a5a6; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Examples:</div>';
            
            currentItem.examples.forEach(example => {
                examplesHTML += `
                    <div style="display: flex; gap: 12px; margin-bottom: 10px; padding: 8px; background-color: rgba(255,255,255,0.05); border-radius: 5px;">
                        <div style="flex: 0 0 33%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; border-right: 1px solid #555; padding-right: 8px;">
                            ${example.word}
                        </div>
                        <div style="flex: 0 0 67%; display: flex; flex-direction: column; justify-content: center;">
                            <div style="font-size: 0.75rem; color: #a8c5dd; margin-bottom: 4px;">${example.furigana}</div>
                            <div style="font-size: 0.8rem; color: #bdc3c7; font-style: italic;">${example.meaning}</div>
                        </div>
                    </div>
                `;
            });
            
            examplesHTML += '</div>';
            examplesBack.innerHTML = examplesHTML;
        } else {
            examplesBack.classList.add('style-hidden');
            examplesBack.innerHTML = '';
        }
    }, 200); 
}

function openStudyGroup(items, isCompound = false) {
    activeStudyGroup = items.slice();
    isCompoundGroup = isCompound;

    if (activeStudyGroup.length === 0) {
        alert("No kanji available inside this specific index selection.");
        return;
    }

    shuffleArray(activeStudyGroup);
    currentIndex = 0;
    updateCard();

    mainMenu.classList.add('style-hidden');
    subMenu.classList.add('style-hidden');
    flashcardScreen.classList.remove('style-hidden');
}

// Show second menu after choosing N5, N4, or N3
function showLevelOptions(level) {
    selectedLevel = level;
    subMenuTitle.innerText = `JLPT ${level}`;
    mainMenu.classList.add('style-hidden');
    subMenu.classList.remove('style-hidden');
}

// Core Function called by Sub Menu Buttons
function startGroup(startIndex, endIndex) {
    let filteredByLevel = masterKanjiDatabase.filter(item => item.level === selectedLevel);
    openStudyGroup(filteredByLevel.slice(startIndex, endIndex));
}

function startCompoundGroup() {
    openStudyGroup(compoundDatabase[selectedLevel] || [], true);
}

function returnToMainMenu() {
    flashcardScreen.classList.add('style-hidden');
    subMenu.classList.add('style-hidden');
    mainMenu.classList.remove('style-hidden');
}

// Return to Main Menu
backBtn.addEventListener('click', returnToMainMenu);
levelBackBtn.addEventListener('click', returnToMainMenu);

// Fetch base JSON storage file on background startup load
async function loadKanjiData() {
    try {
        const kanjiResponse = await fetch('kanji.json');
        const compoundResponse = await fetch('compound.json');
        masterKanjiDatabase = await kanjiResponse.json();
        compoundDatabase = await compoundResponse.json();
    } catch (error) {
        console.error("Error connecting to Kanji JSON file storage source:", error);
    }
}
loadKanjiData();

function showNextCard() {
    if (activeStudyGroup.length > 0) {
        currentIndex = (currentIndex + 1) % activeStudyGroup.length;
        updateCard();
    }
}

function showPreviousCard() {
    if (activeStudyGroup.length > 0) {
        currentIndex = (currentIndex - 1 + activeStudyGroup.length) % activeStudyGroup.length;
        updateCard();
    }
}

// Card tap areas: left = next, center = flip, right = previous
flashcard.addEventListener('click', event => {
    const cardBounds = flashcard.getBoundingClientRect();
    const tapPosition = event.clientX - cardBounds.left;
    const cardThird = cardBounds.width / 3;

    if (tapPosition < cardThird) {
        showNextCard();
    } else if (tapPosition > cardThird * 2) {
        showPreviousCard();
    } else {
        flashcard.classList.toggle('flipped');
    }
});
