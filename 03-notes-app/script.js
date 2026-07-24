const STORAGE_KEY = "notes";

const noteModal = document.querySelector(".note-modal");
const closeModal = document.querySelector(".close");
const addNoteBtn = document.querySelector("#add-note-btn");
const form = document.querySelector(".form-box");
const imageUrlInput = document.querySelector("#imageUrl");
const fullNameInput = document.querySelector("#fullName");
const homeTownInput = document.querySelector("#homeTown");
const purposeInput = document.querySelector("#purpose");
const stackContainer = document.querySelector(".stack");
const upBtn = document.querySelectorAll(".controls button")[1];
const downBtn = document.querySelectorAll(".controls button")[2];

let currentCardIndex = 0;

if (addNoteBtn && noteModal) {
    addNoteBtn.addEventListener("click", () => {
        noteModal.style.display = "flex";
    });
}

if (closeModal && noteModal) {
    closeModal.addEventListener("click", (event) => {
        event.preventDefault();
        noteModal.style.display = "none";
    });
}

function saveToLocalStorage(note) {
    const existingNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existingNotes.push(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingNotes));
}

function createCardElement(noteData) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = noteData.imageUrl;
    card.appendChild(img);

    const name = document.createElement("h2");
    name.textContent = noteData.fullName;
    card.appendChild(name);

    const rowOne = document.createElement("div");
    rowOne.className = "row";
    const homeTownLabel = document.createElement("span");
    homeTownLabel.textContent = "Home town";
    const homeTownValue = document.createElement("span");
    homeTownValue.textContent = noteData.homeTown;
    rowOne.appendChild(homeTownLabel);
    rowOne.appendChild(homeTownValue);
    card.appendChild(rowOne);

    const rowTwo = document.createElement("div");
    rowTwo.className = "row";
    const purposeLabel = document.createElement("span");
    purposeLabel.textContent = "Purpose";
    const purposeValue = document.createElement("span");
    purposeValue.textContent = noteData.purpose;
    rowTwo.appendChild(purposeLabel);
    rowTwo.appendChild(purposeValue);
    card.appendChild(rowTwo);

    return card;
}

function updateCardStack() {
    const allCards = stackContainer.querySelectorAll(".card");
    const totalCards = allCards.length;

    allCards.forEach((card, index) => {
        card.classList.remove("active", "back1", "back2");

        const distance = (index - currentCardIndex + totalCards) % totalCards;

        if (distance === 0) {
            card.classList.add("active");
            card.style.zIndex = 10;
        } else if (distance === 1) {
            card.classList.add("back1");
            card.style.zIndex = 9;
        } else if (distance === 2) {
            card.classList.add("back2");
            card.style.zIndex = 8;
        } else {
            card.style.zIndex = 0;
        }
    });
}

function showCards() {
    let allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    stackContainer.innerHTML = "";

    allNotes.forEach(noteData => {
        const card = createCardElement(noteData);
        stackContainer.appendChild(card);
    });

    currentCardIndex = allNotes.length - 1;
    updateCardStack();
}

if (form && imageUrlInput && fullNameInput && homeTownInput && purposeInput) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const imageUrl = imageUrlInput.value.trim();
        const fullName = fullNameInput.value.trim();
        const homeTown = homeTownInput.value.trim();
        const purpose = purposeInput.value.trim();

        const newNote = {
            id: Date.now().toString(),
            imageUrl,
            fullName,
            homeTown,
            purpose,
        };

        saveToLocalStorage(newNote);

        // Live update - add card immediately
        const newCard = createCardElement(newNote);
        stackContainer.appendChild(newCard);
        currentCardIndex = stackContainer.querySelectorAll(".card").length - 1;
        updateCardStack();

        form.reset();
        noteModal.style.display = "none";
    });
}

// Navigation buttons
if (upBtn) {
    upBtn.addEventListener("click", () => {
        const totalCards = stackContainer.querySelectorAll(".card").length;
        if (totalCards > 0) {
            currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
            updateCardStack();
        }
    });
}

if (downBtn) {
    downBtn.addEventListener("click", () => {
        const totalCards = stackContainer.querySelectorAll(".card").length;
        if (totalCards > 0) {
            currentCardIndex = (currentCardIndex + 1) % totalCards;
            updateCardStack();
        }
    });
}

showCards();