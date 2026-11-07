
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("journal-form");
    const titleInput = document.getElementById("journal-title");
    const emotionInput = document.getElementById("journal-emotion");
    const contentInput = document.getElementById("journal-content");
    const list = document.getElementById("journal-list");
    const message = document.getElementById("journal-message");
    const characterCount = document.getElementById("character-count");

    contentInput.addEventListener("input", () => {
        characterCount.textContent = `${contentInput.value.length}/5000`;
    });

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function renderJournals() {

        const journals = EmocareStorage.get("emocare_journals");

        if (!journals.length) {
            list.innerHTML = `
                <div class="bg-white p-8 rounded-2xl text-center text-gray-400">
                    Your reflections will appear here.
                </div>
            `;
            return;
        }

        list.innerHTML = journals.map(item => `
            <article class="bg-white p-7 rounded-3xl soft-shadow">
                <div class="flex justify-between items-start gap-4">

                    <div>
                        <span class="text-xs text-sage font-semibold uppercase tracking-widest">
                            ${escapeHTML(item.emotion)}
                        </span>

                        <h3 class="font-serif text-2xl mt-3">
                            ${escapeHTML(item.title)}
                        </h3>
                    </div>

                    <button type="button" data-delete="${item.id}"
                            class="text-sm text-red-400 hover:text-red-600">
                        Delete
                    </button>

                </div>

                <p class="text-xs text-gray-400 mt-3">
                    ${formatDate(item.date)} · ${formatTime(item.date)}
                </p>

                <p class="text-gray-500 leading-8 mt-5 whitespace-pre-wrap break-words">${escapeHTML(item.content)}</p>
            </article>
        `).join("");

        list.querySelectorAll("[data-delete]").forEach(button => {
            button.addEventListener("click", () => {

                if (confirm("Delete this journal entry?")) {
                    EmocareStorage.remove("emocare_journals", button.dataset.delete);
                    renderJournals();
                }

            });
        });
    }

    form.addEventListener("submit", event => {

        event.preventDefault();

        const item = {
            id: createId(),
            title: titleInput.value.trim(),
            emotion: emotionInput.value,
            content: contentInput.value.trim(),
            date: new Date().toISOString()
        };

        if (!item.title || !item.emotion || !item.content) {
            message.textContent = "Please complete all fields.";
            message.className = "text-sm mt-4 text-red-500";
            return;
        }

        if (!EmocareStorage.add("emocare_journals", item)) {
            message.textContent = "Unable to save your journal.";
            message.className = "text-sm mt-4 text-red-500";
            return;
        }

        message.textContent = "Your journal has been saved.";
        message.className = "text-sm mt-4 text-sage font-semibold";

        form.reset();
        characterCount.textContent = "0/5000";

        renderJournals();

    });

    renderJournals();

});
