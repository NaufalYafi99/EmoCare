document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("mood-form");
    if (!form) return;

    const options = document.querySelectorAll(".mood-option");
    const selectedMood = document.getElementById("selected-mood");
    const intensity = document.getElementById("intensity");
    const intensityValue = document.getElementById("intensity-value");
    const historyContainer = document.getElementById("mood-history");
    const message = document.getElementById("mood-message");
    const noteInput = document.getElementById("mood-note");

    let selectedEmoji = "";

    options.forEach(option => {
        option.addEventListener("click", () => {
            options.forEach(item => item.classList.remove("selected"));
            option.classList.add("selected");
            selectedMood.value = option.dataset.mood || "";
            selectedEmoji = option.dataset.emoji || "";
            message.textContent = "";
        });
    });

    intensity.addEventListener("input", () => {
        intensityValue.textContent = intensity.value;
    });

    function renderHistory() {
        const moods = EmocareStorage.get("emocare_moods")
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        historyContainer.replaceChildren();

        if (!moods.length) {
            const empty = document.createElement("div");
            empty.className = "bg-white rounded-2xl p-7 text-center text-gray-400";
            empty.textContent = "No mood records yet. Start with your first check-in.";
            historyContainer.appendChild(empty);
            return;
        }

        moods.forEach(item => {
            const card = document.createElement("article");
            card.className = "bg-white p-6 rounded-2xl soft-shadow flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-start";

            const info = document.createElement("div");
            info.className = "flex items-start gap-4 min-w-0";

            const emoji = document.createElement("span");
            emoji.className = "text-3xl";
            emoji.textContent = item.emoji || "🌿";

            const details = document.createElement("div");
            details.className = "min-w-0";

            const title = document.createElement("h3");
            title.className = "font-semibold text-charcoal";
            title.textContent = item.emotion || item.mood || "Mood";

            const date = document.createElement("p");
            date.className = "text-xs text-gray-400 mt-1";
            date.textContent = `${formatDate(item.date)} · ${formatTime(item.date)}`;

            const level = document.createElement("p");
            level.className = "text-sm text-gray-500 mt-2";
            level.textContent = `Intensity: ${item.intensity || 3}/5`;

            details.append(title, date, level);

            if (item.note && item.note.trim()) {
                const note = document.createElement("p");
                note.className = "text-sm text-gray-600 mt-3 whitespace-pre-wrap break-words";
                note.textContent = `Note: ${item.note}`;
                details.appendChild(note);
            }

            info.append(emoji, details);

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.dataset.delete = item.id;
            deleteButton.className = "text-sm text-red-400 hover:text-red-600 self-start";
            deleteButton.textContent = "Delete";

            card.append(info, deleteButton);
            historyContainer.appendChild(card);
        });

        historyContainer.querySelectorAll("[data-delete]").forEach(button => {
            button.addEventListener("click", () => {
                if (confirm("Delete this mood record?")) {
                    EmocareStorage.remove("emocare_moods", button.dataset.delete);
                    renderHistory();
                }
            });
        });
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!selectedMood.value) {
            message.textContent = "Please select your mood first.";
            message.className = "text-sm mt-4 text-red-500";
            return;
        }

        const item = {
            id: createId(),
            emotion: selectedMood.value,
            mood: selectedMood.value,
            emoji: selectedEmoji,
            intensity: Number(intensity.value),
            note: noteInput.value.trim(),
            date: new Date().toISOString()
        };

        if (!EmocareStorage.add("emocare_moods", item)) {
            message.textContent = "Unable to save. Please check your browser storage.";
            message.className = "text-sm mt-4 text-red-500";
            return;
        }

        message.textContent = "Your mood has been saved successfully.";
        message.className = "text-sm mt-4 text-sage font-semibold";

        form.reset();
        selectedMood.value = "";
        selectedEmoji = "";
        intensity.value = 3;
        intensityValue.textContent = "3";
        options.forEach(item => item.classList.remove("selected"));

        renderHistory();
    });

    renderHistory();
});
