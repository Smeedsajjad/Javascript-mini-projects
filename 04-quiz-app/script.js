const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            { option: "A. Hyper Text Markup Language", correct: true },
            { option: "B. High Text Machine Language", correct: false },
            { option: "C. Hyper Tool Markup Link", correct: false },
            { option: "D. Home Text Mark Language", correct: false },
        ],
    },
    {
        question: "Which tag is used for a paragraph in HTML?",
        options: [
            { option: "A. <h1>", correct: false },
            { option: "B. <p>", correct: true },
            { option: "C. <div>", correct: false },
            { option: "D. <span>", correct: false },
        ],
    },
    {
        question: "Which property is used in CSS to change text color?",
        options: [
            { option: "A. font-color", correct: false },
            { option: "B. text-color", correct: false },
            { option: "C. color", correct: true },
            { option: "D. background-color", correct: false },
        ],
    },
];

let score = 0;
let currentQuestionIndex = 0;
let quizFinished = false;

const question = document.querySelector(".question");
const optionsContainer = document.querySelector(".options");
const nextBtn = document.querySelector(".next-btn");
const displayScore = document.querySelector("span");

function showQuestion() {
    displayScore.textContent = score;

    if (quizFinished) {
        question.textContent = `Quiz Finished! Your score is ${score}/${questions.length}`;
        optionsContainer.innerHTML = "";
        nextBtn.textContent = "Restart";
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    question.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((item) => {
        const button = document.createElement("button");
        button.textContent = item.option;
        button.classList.add("option-btn");

        button.addEventListener("click", () => selectAnswer(button, item.correct));

        optionsContainer.appendChild(button);
    });
}

function selectAnswer(button, correct) {
    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach((btn) => (btn.disabled = true));

    if (correct) {
        score += 1;
        button.style.backgroundColor = "aquamarine";
    } else {
        button.style.backgroundColor = "red";

        const currentQuestion = questions[currentQuestionIndex];
        buttons.forEach((optionButton, index) => {
            if (currentQuestion.options[index].correct) {
                optionButton.style.backgroundColor = "aquamarine";
            }
        });
    }
}

nextBtn.addEventListener("click", () => {
    if (quizFinished) {
        score = 0;
        currentQuestionIndex = 0;
        quizFinished = false;
        nextBtn.textContent = "Next";
        showQuestion();
        return;
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        quizFinished = true;
        showQuestion();
    }
});

showQuestion();
