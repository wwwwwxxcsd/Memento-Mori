const allTexts = {
    ua: {
        1: "Не вдавайся гріху, і не будь безумний: навіщо тобі вмирати не свого часу.",
        2: "Думка про очікуване і день смерті робить у них роздуми та страх серця.",
        3: "Не радуйся смерті людини, пам'ятай, що всі ми помремо.",
        4: "Коротке і сумне наше життя, і немає людині спасіння від смерті.",
        5: "Не бійся смертного вироку: згадай про предків твоїх та нащадків."
    },
    lat: {
        1: "Memento mori, nam et tu homo es. Respice post te, hominem te memento.",
        2: "Omnia mors aequat. Mors sola fatetur quantula sint hominum corpuscula.",
        3: "In paradisum deducant te Angeli; in tuo adventu suscipiant te martyres.",
        4: "Dies irae, dies illa, solvet saeclum in favilla, teste David cum Sibylla.",
        5: "Vade retro Satana! Nunquam suade mihi vana! Ipse venena bibas!"
    }
};

let currentLang = 'ua';
let selectedString = "";
let isStarted = false;
let startTime = 0;
let errorsCount = 0;

function changeLang(lang) {
    currentLang = lang;
    document.getElementById('uaBtn').classList.toggle('active', lang === 'ua');
    document.getElementById('latBtn').classList.toggle('active', lang === 'lat');
}

function selectText(num) {
    selectedString = allTexts[currentLang][num];
    const screen = document.getElementById("selectionScreen");
    const layout = document.getElementById("mainLayout");
    const audio = document.getElementById("bgMusic");

    if (audio.paused) {
        audio.play().catch(() => {});
    }

    screen.classList.add("fade-out");

    setTimeout(() => {
        screen.style.display = "none";
        layout.style.display = "grid";
        setTimeout(() => layout.classList.add("visible"), 50);
    }, 1000);
}

// Функція для повернення до вибору тексту БЕЗ перезавантаження сторінки
function resetToSelection() {
    isStarted = false;
    selectedString = "";

    const screen = document.getElementById("selectionScreen");
    const layout = document.getElementById("mainLayout");
    const startScreen = document.getElementById("startScreen");
    const trainer = document.getElementById("trainer");
    const errorMsg = document.getElementById("error");

    // Повертаємо початковий вигляд екранів
    layout.classList.remove("visible");
    setTimeout(() => {
        layout.style.display = "none";
        screen.style.display = "flex";
        screen.classList.remove("fade-out");

        // Очищуємо робочу область тренажера
        startScreen.style.display = "block";
        trainer.style.display = "none";
        errorMsg.innerHTML = "";

        // Повертаємо слухач для старту
        document.addEventListener("keydown", startListener);
    }, 500);
}

const startListener = (e) => {
    if (selectedString !== "" && !isStarted) {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("trainer").style.display = "block";
        isStarted = true;
        startTime = Date.now();
        errorsCount = 0;
        runTrainer();
        document.removeEventListener("keydown", startListener);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const vol = document.getElementById("volumeRange");
    const audio = document.getElementById("bgMusic");

    vol.addEventListener("input", (e) => audio.volume = e.target.value);
    document.addEventListener("keydown", startListener);
});

function runTrainer() {
    const display = document.getElementById("display");
    const errorMsg = document.getElementById("error");
    let index = 0;
    let hasErrorOnCurrentChar = false;

    display.innerHTML = "";
    const spans = [...selectedString].map(c => {
        const s = document.createElement("span");
        s.textContent = c;
        display.appendChild(s);
        return s;
    });

    const updateVisuals = () => {
        spans.forEach((s, i) => {
            if (i < index) {
                s.className = "typed";
            } else if (i === index) {
                s.className = hasErrorOnCurrentChar ? "error-char" : "current";
            } else {
                s.className = "";
            }
        });
    };
    updateVisuals();

    const onKeyPress = (e) => {
        if (e.key.length !== 1 && e.key !== "Backspace") return;
        if (e.key === " ") e.preventDefault();

        if (e.key === "Backspace") {
            hasErrorOnCurrentChar = false;
            updateVisuals();
            return;
        }

        if (e.key === selectedString[index]) {
            if (!hasErrorOnCurrentChar) index++;
            hasErrorOnCurrentChar = false;
            if (index === selectedString.length) finishSession();
        } else {
            if (!hasErrorOnCurrentChar) errorsCount++;
            hasErrorOnCurrentChar = true;
        }
        updateVisuals();
    };

    function finishSession() {
        document.removeEventListener("keydown", onKeyPress);
        const endTime = Date.now();
        const totalSeconds = Math.floor((endTime - startTime) / 1000);
        const wpm = Math.round((selectedString.length / 5) / (totalSeconds / 60)) || 0;

        errorMsg.innerHTML = `
            <div class="stats-box">
                <p>Статистика проходження:</p>
                <p>Час: <span>${totalSeconds} сек.</span></p>
                <p>Помилок: <span style="color:#f44">${errorsCount}</span></p>
                <p>Швидкість: <span>${wpm} WPM</span></p>
                <button onclick="resetToSelection()" style="margin-top:15px; background:none; border:1px solid #fff; color:#fff; padding:10px; cursor:pointer; font-family:Calligrapher; font-size:18px;">Renovare</button>
            </div>
        `;
    }

    document.addEventListener("keydown", onKeyPress);
}