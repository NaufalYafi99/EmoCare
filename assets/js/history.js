document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("mood-history-list");
    const empty = document.getElementById("history-empty");
    const total = document.getElementById("total-moods");
    const latest = document.getElementById("latest-mood");

    const emojiByMood = {
        "Senang": "😊",
        "Tenang": "😌",
        "Sedih": "😔",
        "Marah": "😠",
        "Cemas": "😟"
    };

    function render() {
        const entries = EmocareStorage.get("emocare_moods")
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        list.replaceChildren();
        total.textContent = entries.length;
        latest.textContent = entries.length
            ? `${entries[0].emoji || emojiByMood[entries[0].emotion] || "🌿"} ${entries[0].emotion || entries[0].mood}`
            : "—";
        empty.hidden = entries.length > 0;

        entries.forEach(entry => {
            const card = document.createElement("article");
            card.className = "history-card";

            const top = document.createElement("div");
            top.className = "history-card-top";

            const info = document.createElement("div");
            info.className = "history-mood-info";

            const emoji = document.createElement("span");
            emoji.className = "history-emoji";
            emoji.textContent = entry.emoji || emojiByMood[entry.emotion] || "🌿";

            const details = document.createElement("div");
            const title = document.createElement("h3");
            title.textContent = entry.emotion || entry.mood || "Mood";

            const date = document.createElement("p");
            date.className = "history-date";
            date.textContent = `${formatDate(entry.date)} · ${formatTime(entry.date)}`;

            details.append(title, date);
            info.append(emoji, details);
            top.appendChild(info);
            card.appendChild(top);

            const level = document.createElement("p");
            level.className = "history-intensity";
            level.textContent = `Intensity: ${entry.intensity || 3}/5`;
            card.appendChild(level);

            if (entry.note && entry.note.trim()) {
                const noteBox = document.createElement("div");
                noteBox.className = "history-note";
                const label = document.createElement("span");
                label.textContent = "MY NOTE";
                const note = document.createElement("p");
                note.textContent = entry.note;
                noteBox.append(label, note);
                card.appendChild(noteBox);
            }

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "history-delete";
            remove.textContent = "Delete entry";
            remove.addEventListener("click", () => {
                if (confirm("Delete this mood entry?")) {
                    EmocareStorage.remove("emocare_moods", entry.id);
                    render();
                }
            });
            card.appendChild(remove);
            list.appendChild(card);
        });
    }

    render();
});
