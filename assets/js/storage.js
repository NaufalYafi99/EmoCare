/* Shared LocalStorage helper for Emocare */
const EmocareStorage = (() => {
    const LEGACY_MOOD_KEY = "emocare_mood_history";

    function get(key) {
        try {
            const value = localStorage.getItem(key);
            if (!value) return [];
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error(`Unable to read ${key}:`, error);
            return [];
        }
    }

    function add(key, item) {
        try {
            const items = get(key);
            items.push(item);
            localStorage.setItem(key, JSON.stringify(items));
            return true;
        } catch (error) {
            console.error(`Unable to save ${key}:`, error);
            return false;
        }
    }

    function remove(key, id) {
        try {
            const items = get(key);
            const updated = items.filter(item => String(item.id) !== String(id));
            localStorage.setItem(key, JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error(`Unable to remove item from ${key}:`, error);
            return false;
        }
    }

    function getMoodEntries() {
        return get("emocare_moods");
    }

    function saveMoodEntry(mood, note, emoji = "", intensity = 3) {
        const now = new Date();
        const item = {
            id: createId(),
            emotion: mood,
            mood,
            emoji,
            intensity: Number(intensity),
            note: String(note || "").trim(),
            date: now.toISOString(),
            timestamp: now.getTime()
        };
        return add("emocare_moods", item) ? item : null;
    }

    // Migrate entries created by the earlier mood-history storage version.
    function migrateLegacyMoodEntries() {
        const legacy = get(LEGACY_MOOD_KEY);
        if (!legacy.length) return;

        const current = get("emocare_moods");
        const knownIds = new Set(current.map(item => String(item.id)));

        legacy.forEach(entry => {
            if (knownIds.has(String(entry.id))) return;
            const date = entry.timestamp
                ? new Date(entry.timestamp).toISOString()
                : `${entry.date || new Date().toISOString().slice(0, 10)}T${entry.time || "00:00"}:00`;
            current.push({
                id: entry.id || createId(),
                emotion: entry.mood || entry.emotion || "Tidak diketahui",
                mood: entry.mood || entry.emotion || "Tidak diketahui",
                emoji: entry.emoji || "🌿",
                intensity: Number(entry.intensity || 3),
                note: entry.note || "",
                date,
                timestamp: new Date(date).getTime()
            });
        });

        try {
            localStorage.setItem("emocare_moods", JSON.stringify(current));
            localStorage.removeItem(LEGACY_MOOD_KEY);
        } catch (error) {
            console.error("Unable to migrate older mood entries:", error);
        }
    }

    return { get, add, remove, getMoodEntries, saveMoodEntry, migrateLegacyMoodEntries };
})();

function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function formatTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Keep older saved mood data available to the existing pages.
document.addEventListener("DOMContentLoaded", () => {
    EmocareStorage.migrateLegacyMoodEntries();
});
