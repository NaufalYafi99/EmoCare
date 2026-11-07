
document.addEventListener("DOMContentLoaded", () => {

    // Mobile navigation
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("hidden");
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Footer year
    document.querySelectorAll("[data-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // Reveal animation
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-fade-up");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => {
            element.classList.add("animate-fade-up");
        });
    }
});
