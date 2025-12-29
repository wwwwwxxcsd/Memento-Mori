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
let startTime = null;
let totalErrors = 0;

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

    audio.play().catch(() => {});
    screen.classList.add("fade-out");

    setTimeout(() => {
        screen.style.display = "none";
        layout.style.display = "grid";
        setTimeout(() => layout.classList.add("visible"), 50);
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const errorMsg = document.getElementById("error");
    const vol = document.getElementById("volumeRange");
    const audio = document.getElementById("bgMusic");

    vol.addEventListener("input", (e) => audio.volume = e.target.value);

    // ЛОГИКА СКРИМЕРА
    const antichristiCard = document.getElementById("antichristiCard");
    const screamerContainer = document.getElementById("screamerContainer");
    const screamerSound = document.getElementById("screamerSound");

    antichristiCard.addEventListener("click", () => {
        // Устанавливаем громкость (0.5 - средняя)
        screamerSound.volume = 0.5;

        // Показываем скример и играем звук
        screamerContainer.style.display = "flex";
        screamerSound.play();

        // Убираем через 2 секунды
        setTimeout(() => {
            screamerContainer.style.display = "none";
            screamerSound.pause();
            screamerSound.currentTime = 0;
        }, 2000);
    });

    const initialStarter = (e) => {
        if (selectedString !== "" && !isStarted) {
            document.getElementById("startScreen").style.display = "none";
            document.getElementById("trainer").style.display = "block";
            isStarted = true;
            startTime = new Date();
            totalErrors = 0;
            runTrainer();
            document.removeEventListener("keydown", initialStarter);
        }
    };
    document.addEventListener("keydown", initialStarter);

    function runTrainer() {
        let index = 0;
        let isError = false;
        const container = document.querySelector('.central-container');
        display.innerHTML = "";

        const spans = [...selectedString].map(c => {
            const s = document.createElement("span");
            s.textContent = c;
            display.appendChild(s);
            return s;
        });

        const redraw = () => {
            spans.forEach((s, i) => {
                s.className = i < index ? "typed" : i === index ? (isError ? "error-char" : "current") : "";
            });
        };
        redraw();

        const onKey = (e) => {
            if (e.key === "Backspace") { isError = false; redraw(); return; }
            if (e.key.length !== 1) return;
            if (e.key === " ") e.preventDefault();

            if (!isError && e.key === selectedString[index]) {
                index++;
                if (index === selectedString.length) {
                    const endTime = new Date();
                    const timeDiff = Math.floor((endTime - startTime) / 1000);

                    errorMsg.innerHTML = `
                        <div class="stats-container">
                            <p>Час: <span class="stats-val">${timeDiff} сек.</span></p>
                            <p>Помилок: <span class="stats-val" style="color:#a00">${totalErrors}</span></p>
                            <button onclick="location.reload()" style="color:#fff; background:none; border:1px solid #444; cursor:pointer; padding:8px 15px; font-family:Calligrapher; margin-top:10px">Renovare (Спробувати ще)</button>
                        </div>
                    `;
                    document.removeEventListener("keydown", onKey);
                }
            } else {
                if (!isError) {
                    totalErrors++;
                    container.classList.add('shake', 'error-flash');
                    setTimeout(() => {
                        container.classList.remove('shake', 'error-flash');
                    }, 300);
                }
                isError = true;
            }
            redraw();
        };
        document.addEventListener("keydown", onKey);
    }
});