
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".breathing-container");
    const phaseText = document.getElementById("breathing-phase");
    const timerText = document.getElementById("breathing-timer");
    const instruction = document.getElementById("breathing-instruction");

    const startButton = document.getElementById("start-breathing");
    const stopButton = document.getElementById("stop-breathing");

    if (!container || !startButton || !stopButton) return;

    let interval = null;
    let timeout = null;
    let running = false;
    let phase = "inhale";
    let remaining = 4;

    function updateDisplay() {
        const language = typeof EmocareLanguage !== "undefined"
            ? EmocareLanguage.current
            : "en";

        if (phase === "inhale") {
            phaseText.textContent = language === "id"
                ? "Tarik Napas"
                : "Breathe In";

            instruction.textContent = language === "id"
                ? "Tarik napas perlahan selama 4 detik."
                : "Breathe in slowly for 4 seconds.";
        } else {
            phaseText.textContent = language === "id"
                ? "Hembuskan"
                : "Breathe Out";

            instruction.textContent = language === "id"
                ? "Hembuskan napas perlahan selama 6 detik."
                : "Breathe out gently for 6 seconds.";
        }

        timerText.textContent = remaining;
    }

    function runPhase() {
        if (!running) return;

        container.classList.remove("inhale", "exhale");
        container.classList.add(phase);

        remaining = phase === "inhale" ? 4 : 6;

        updateDisplay();

        clearInterval(interval);

        interval = setInterval(() => {
            remaining--;
            timerText.textContent = remaining;

            if (remaining <= 0) {
                clearInterval(interval);

                phase = phase === "inhale"
                    ? "exhale"
                    : "inhale";

                runPhase();
            }
        }, 1000);
    }

    function startBreathing() {
        if (running) return;

        running = true;
        phase = "inhale";

        container.classList.add("active");

        startButton.disabled = true;
        stopButton.disabled = false;

        startButton.classList.add("opacity-50", "cursor-not-allowed");
        stopButton.classList.remove("opacity-50", "cursor-not-allowed");

        runPhase();
    }

    function stopBreathing() {
        running = false;

        clearInterval(interval);
        clearTimeout(timeout);

        container.classList.remove(
            "active",
            "inhale",
            "exhale"
        );

        phase = "inhale";
        remaining = 4;

        phaseText.textContent = "Ready?";
        timerText.textContent = "4";

        const language = typeof EmocareLanguage !== "undefined"
            ? EmocareLanguage.current
            : "en";

        instruction.textContent = language === "id"
            ? "Latihan selesai. Luangkan waktu sejenak untuk beristirahat."
            : "Exercise stopped. Take a moment to rest.";

        startButton.disabled = false;
        stopButton.disabled = true;

        startButton.classList.remove("opacity-50", "cursor-not-allowed");
        stopButton.classList.add("opacity-50", "cursor-not-allowed");
    }

    startButton.addEventListener("click", startBreathing);
    stopButton.addEventListener("click", stopBreathing);

    document.addEventListener("emocare:languageChanged", () => {
        if (running) {
            updateDisplay();
        } else {
            const language = EmocareLanguage.current;

            phaseText.textContent = language === "id"
                ? "Siap?"
                : "Ready?";

            instruction.textContent = language === "id"
                ? "Bersiaplah untuk latihan pernapasan yang menenangkan."
                : "Prepare yourself for a relaxing breathing exercise.";
        }
    });
});
