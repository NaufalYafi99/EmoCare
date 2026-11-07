
document.addEventListener("DOMContentLoaded", () => {

    const moods = EmocareStorage.get("emocare_moods");
    const journals = EmocareStorage.get("emocare_journals");

    const today = new Date().toDateString();

    const todayMood = moods.find(item => {
        return new Date(item.date).toDateString() === today;
    });

    const moodElement = document.getElementById("today-mood");
    const moodCount = document.getElementById("mood-count");
    const journalCount = document.getElementById("journal-count");

    if (moodElement) {
        moodElement.textContent = todayMood
            ? `${todayMood.emoji} ${todayMood.emotion}`
            : "Not recorded";
    }

    if (moodCount) {
        moodCount.textContent = moods.length;
    }

    if (journalCount) {
        journalCount.textContent = journals.length;
    }

});
