const socket = connectToSocket();

const eQuestionCount = document.getElementById("questions");
const eIdRange = [
    document.getElementById("rangeLB"),
    document.getElementById("rangeUB"),
];
const eWordType = document.getElementById("showWordType");
const eWordDirection = {
    LTE: document.getElementById("dirLTE"),
    ETL: document.getElementById("dirETL"),
};
const eTestContainer = document.getElementById("test-container");
const eTestConfig = document.getElementById("test-settings");
let allWords;

socket.emit("get-words");
socket.on("get-words", words => (allWords = words));

function test() {
    const range = [
        +eIdRange[0].value,
        eIdRange[1].value === "" ? Infinity : +eIdRange[1].value
    ];
    const pool = allWords.filter(w => {
        let ok = true;
        ok &&= w.ID >= range[0] && w.ID < range[1];
        if (eWordType.value !== "any") ok &&= w.type.startsWith(eWordType.value);
        return ok;
    });

    const test = [], targetCount = +eQuestionCount.value;
    const [showProp, guessProp] = eWordDirection.ETL.checked ? ["translation", "word"] : ["word", "translation"];
    while (test.length < targetCount && pool.length > 0) {
        let idx = Math.floor(Math.random() * pool.length);
        test.push(pool[idx]);
        pool.splice(idx, 1);
    }

    eTestConfig.style.display = "none";
    eTestContainer.style.display = "block";
    eTestContainer.innerHTML = '';
    const eTest = document.createElement("div");
    eTestContainer.appendChild(eTest);
    eTest.classList.add("settings");
    test.forEach((w, i) => {
        let p = document.createElement("p");
        eTest.appendChild(p);
        w.element = p;

        p.insertAdjacentHTML("beforeend", `<span>${i + 1})</span>&nbsp;&nbsp;`);
        p.insertAdjacentHTML("beforeend", `<strong style="font-size: 22px;">${w[showProp]}</strong> &equals;&gt; &nbsp;&nbsp; `);
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = eWordDirection.ETL.checked ? "Latin" : "English";
        p.appendChild(input);
        w.eInput = input;
    });

    eTest.insertAdjacentHTML("beforeend", "<br>");
    let btn = document.createElement("button");
    btn.innerHTML = "<i class=\"fa fa-edit\"></i> Check Answers";
    eTest.appendChild(btn);
    btn.addEventListener("click", () => check(showProp, guessProp, test));

    eTest.insertAdjacentHTML("beforeend", "<br>");
    btn = document.createElement("button");
    btn.innerHTML = "<i class=\"fa fa-refresh\"></i> New Test";
    eTest.appendChild(btn);
    btn.addEventListener("click", () => {
        eTestConfig.style.display = "block";
        eTestContainer.style.display = "none";
        eTestContainer.innerHTML = "";
    });
}

function check(showProp, guessProp, test) {
    let score = 0;
    test.forEach(w => {
        const guess = w.eInput.value.trim().replace("/\(.*\)/","").replace("/[\s\!\?\.\-]/","");
        const correct = w[guessProp].split(",").map(s => s.trim().replace("/\(.*\)/","").replace("/[\s\!\?\.\-]/",""));
        const isCorrect = correct.includes(guess);
        if (isCorrect) score++;

        w.element.insertAdjacentHTML("beforeend", `<span class='${isCorrect ? "good" : "bad"}'><big>${isCorrect ? "&check;" : "&cross;"}</big> ${w[guessProp]}</span>`);
    });

    const percentage = score / test.length * 100, grade = calculateGrade(percentage);
    eTestContainer.insertAdjacentHTML("beforeend", `<p><b class='mark'>&nbsp;&nbsp; <span style='font-size:22px'>Score: ${score}/${test.length} | ${Math.round(percentage)}% | ${grade}</span></b></p>`);
}

function calculateGrade(percentage) {
    if (percentage === 100) return "A**";
    if (percentage >= 90) return "A*";
    if (percentage >= 75) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    if (percentage >= 30) return "U";
    return "F";
}
