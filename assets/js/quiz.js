
document.addEventListener("DOMContentLoaded", () => {

    const questions = [
        {
            question: "What does emotional awareness mean?",
            options: [
                "Ignoring negative feelings",
                "Recognizing and understanding your emotions",
                "Always feeling happy",
                "Avoiding difficult situations"
            ],
            answer: 1,
            explanation: "Emotional awareness means recognizing and understanding what you feel."
        },
        {
            question: "Which response is a healthy way to handle frustration?",
            options: [
                "Blaming everyone",
                "Pretending nothing happened",
                "Pausing and identifying what caused it",
                "Making an immediate decision"
            ],
            answer: 2,
            explanation: "Taking a pause can help you understand the situation before responding."
        },
        {
            question: "Why is journaling useful?",
            options: [
                "It removes every problem",
                "It helps organize thoughts and reflect on emotions",
                "It guarantees happiness",
                "It prevents all negative emotions"
            ],
            answer: 1,
            explanation: "Writing can help you express thoughts and notice emotional patterns."
        },
        {
            question: "What is empathy?",
            options: [
                "Agreeing with everyone",
                "Ignoring other people's feelings",
                "Trying to understand another person's perspective",
                "Solving everyone's problems"
            ],
            answer: 2,
            explanation: "Empathy involves trying to understand another person's feelings and perspective."
        },
        {
            question: "What should you do when emotions feel overwhelming?",
            options: [
                "Force yourself to ignore them",
                "Pause, seek a comfortable space, and consider talking to someone you trust",
                "Make every decision immediately",
                "Assume your feelings will never change"
            ],
            answer: 1,
            explanation: "Taking a pause and reaching out to someone trustworthy can be helpful."
        }
    ];

    const questionNumber = document.getElementById("question-number");
    const progressText = document.getElementById("question-progress");
    const progressBar = document.getElementById("progress-bar");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("answer-options");
    const feedback = document.getElementById("quiz-feedback");
    const nextButton = document.getElementById("next-question");
    const restartButton = document.getElementById("restart-quiz");

    const quizContainer = document.getElementById("quiz-container");
    const resultContainer = document.getElementById("quiz-result");

    const finalScore = document.getElementById("final-score");
    const resultMessage = document.getElementById("result-message");

    let currentQuestion = 0;
    let score = 0;
    let answered = false;

    function renderQuestion() {

        answered = false;

        const question = questions[currentQuestion];

        const progress = Math.round(
            (currentQuestion / questions.length) * 100
        );

        questionNumber.textContent =
            `Question ${currentQuestion + 1} of ${questions.length}`;

        progressText.textContent = `${progress}%`;
        progressBar.style.width = `${progress}%`;

        questionText.textContent = question.question;

        feedback.classList.add("hidden");
        feedback.textContent = "";

        nextButton.disabled = true;
        nextButton.classList.add("opacity-40");

        optionsContainer.innerHTML = "";

        question.options.forEach((option, index) => {

            const button = document.createElement("button");

            button.type = "button";
            button.textContent = option;

            button.className =
                "w-full text-left p-5 rounded-2xl border border-gray-200 hover:border-sage hover:bg-[#F3F6F1] transition";

            button.addEventListener("click", () => {
                selectAnswer(index);
            });

            optionsContainer.appendChild(button);

        });

    }

    function selectAnswer(selectedIndex) {

        if (answered) return;

        answered = true;

        const question = questions[currentQuestion];
        const buttons = optionsContainer.querySelectorAll("button");

        buttons.forEach((button, index) => {

            button.disabled = true;

            if (index === question.answer) {
                button.classList.add("border-sage", "bg-[#EDF2EA]");
            }

            if (index === selectedIndex && index !== question.answer) {
                button.classList.add("border-red-300", "bg-red-50");
            }

        });

        const isCorrect = selectedIndex === question.answer;

        if (isCorrect) {
            score++;
        }

        feedback.classList.remove("hidden");
        feedback.className = isCorrect
            ? "mt-7 p-5 rounded-2xl bg-[#EDF2EA] text-sage-dark text-sm leading-7"
            : "mt-7 p-5 rounded-2xl bg-[#FCEFEB] text-gray-600 text-sm leading-7";

        feedback.textContent =
            (isCorrect ? "Correct! " : "Not quite. ") +
            question.explanation;

        nextButton.disabled = false;
        nextButton.classList.remove("opacity-40");

    }

    function finishQuiz() {

        quizContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden");

        progressBar.style.width = "100%";
        finalScore.textContent = `${score}/${questions.length}`;

        if (score === questions.length) {
            resultMessage.textContent =
                "Excellent! You have a strong understanding of the concepts covered in this quiz.";
        } else if (score >= 3) {
            resultMessage.textContent =
                "Good effort! Keep exploring emotional awareness and practice what you have learned.";
        } else {
            resultMessage.textContent =
                "Every learning journey starts somewhere. Review the explanations and try again.";
        }

        EmocareStorage.add("emocare_quiz_results", {
            id: createId(),
            score,
            total: questions.length,
            date: new Date().toISOString()
        });

    }

    function restartQuiz() {

        currentQuestion = 0;
        score = 0;
        answered = false;

        quizContainer.classList.remove("hidden");
        resultContainer.classList.add("hidden");

        restartButton.classList.add("hidden");

        renderQuestion();

    }

    nextButton.addEventListener("click", () => {

        if (!answered) return;

        currentQuestion++;

        if (currentQuestion >= questions.length) {
            finishQuiz();
        } else {
            renderQuestion();
        }

    });

    restartButton.addEventListener("click", restartQuiz);
    document.getElementById("try-again").addEventListener("click", restartQuiz);

    renderQuestion();

});
