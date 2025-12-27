const allTexts = {
    ua: {
        1: "Не вдавайся гріху, і не будь безумний: навіщо тобі вмирати не свого часу. Ек.7,17",
        2: "Думка про очікуване і день смерті робить у них роздуми та страх серця. Сир.40,2",
        3: "Не радуйся смерті людини, пам'ятай, що всі ми помремо. Сир.8,8",
        4: "Коротке і сумне наше життя, і немає людині спасіння від смерті. Прем.2,1",
        5: "Не бійся смертного вироку: згадай про предків твоїх та нащадків. Сір.41,5"
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

    document.addEventListener("keydown", () => {
        if (selectedString !== "" && !isStarted) {
            document.getElementById("startScreen").style.display = "none";
            document.getElementById("trainer").style.display = "block";
            isStarted = true;
            runTrainer();
        }
    });

    function runTrainer() {
        let index = 0;
        let isError = false;
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
                    errorMsg.innerHTML = 'Finitum. <button onclick="location.reload()" style="color:#fff; background:none; border:1px solid #444; cursor:pointer; padding:5px 10px; font-family:Calligrapher">Renovare</button>';
                    document.removeEventListener("keydown", onKey);
                }
            } else { isError = true; }
            redraw();
        };
        document.addEventListener("keydown", onKey);
    }
});