// ============================
// animations.js
// Drop this in your project and link it AFTER app.js:
// <script type="module" src="app.js"></script>
// <script src="animations.js"></script>
// ============================

// ============================
// 1. Staggered fade-in for note cards on load
// ============================
function animateCardsIn() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 100);
    });
}

// ============================
// 2. Animate a single newly created card
// Call this right after appending a new note card to the grid
// ============================
function animateNewCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
}

// ============================
// 3. Button press "squish" feedback
// ============================
function addButtonPressEffect(button) {
    button.style.transition = "transform 0.1s ease";

    button.addEventListener("mousedown", () => {
        button.style.transform = "scale(0.95)";
    });

    ["mouseup", "mouseleave"].forEach(evt => {
        button.addEventListener(evt, () => {
            button.style.transform = "scale(1)";
        });
    });
}

// ============================
// 4. Ripple effect on button click
// ============================
function addRippleEffect(button) {
    button.style.position = "relative";
    button.style.overflow = "hidden";

    button.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255, 130, 208, 0.4)";
        ripple.style.transform = "scale(0)";
        ripple.style.pointerEvents = "none";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        ripple.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";

        this.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.style.transform = "scale(2.5)";
            ripple.style.opacity = "0";
        });

        setTimeout(() => ripple.remove(), 600);
    });
}

// ============================
// 5. Heart icon pulse animation (loops forever)
// ============================
function animateHeartPulse(icon) {
    let scale = 1;
    let growing = true;

    function pulse() {
        if (growing) {
            scale += 0.005;
            if (scale >= 1.15) growing = false;
        } else {
            scale -= 0.005;
            if (scale <= 1) growing = true;
        }
        icon.style.transform = `scale(${scale})`;
        requestAnimationFrame(pulse);
    }
    pulse();
}

// ============================
// 6. Fade-in effect whenever the AI response text updates
// Keeps the "Overview" heading, replaces only the text below it
// ============================
function setAIResponse(container, text) {
    container.style.transition = "opacity 0.2s ease";
    container.style.opacity = "0";

    setTimeout(() => {
        container.innerHTML = `<h2>Overview</h2>${text}`;
        container.style.opacity = "1";
    }, 200);
}

// ============================
// 7. Textarea glow on focus
// ============================
function addTextareaGlow(textarea) {
    textarea.addEventListener("focus", () => {
        textarea.style.transition = "box-shadow 0.3s ease";
        textarea.style.boxShadow = "0 0 12px rgba(255, 130, 208, 0.4)";
    });

    textarea.addEventListener("blur", () => {
        textarea.style.boxShadow = "none";
    });
}

// ============================
// Wire everything up once the page loads
// ============================
document.addEventListener("DOMContentLoaded", () => {
    animateCardsIn();

    const postButton = document.getElementById("postButton");
    if (postButton) {
        addButtonPressEffect(postButton);
        addRippleEffect(postButton);
    }

    const heartIcon = document.querySelector("#nav-icon img");
    if (heartIcon) {
        animateHeartPulse(heartIcon);
    }

    const textarea = document.getElementById("promptInput");
    if (textarea) {
        addTextareaGlow(textarea);
    }
});

// Export helpers so app.js can call them after loading notes / AI responses
export { animateNewCard, setAIResponse };