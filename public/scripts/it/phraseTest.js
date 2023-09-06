const divConfig = document.getElementById('test-config');
const divTest = document.getElementById('test-body');
var wordCategories, allPhrases;
const check = "&#10003;", cross = "&#10008;";

const TYPE_IT_EN = 1;
const TYPE_EN_IT = 2;
const TYPE_IT_SPEECH = 3;

// Populate #test-config
function loadConfig() {
    let table = document.createElement('table'), tbody = table.createTBody();
    divConfig.appendChild(table);

    // Word Count
    let tr = document.createElement('tr'), td = document.createElement('td');
    tr.insertAdjacentHTML('beforeend', '<td><strong>Phrases</strong></td>');
    tbody.appendChild(tr);
    tr.appendChild(td);
    const inputPhraseCount = document.createElement('input');
    inputPhraseCount.type = "number";
    inputPhraseCount.min = 1;
    inputPhraseCount.value = 10;
    td.appendChild(inputPhraseCount);

    // Test type
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Test Subject</strong></td>");
    td = document.createElement('td');
    tr.appendChild(td);
    const selectType = document.createElement('select');
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_IT_EN}">Italian &rarr; English</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_EN_IT}">English &rarr; Italian</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_IT_SPEECH}">Italian from Pronunctiation</option>`);
    td.appendChild(selectType);

    // Phrase category(ies)
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Phrase Category</strong></td>");
    const createSelectCat = () => {
        selectCatCount++;
        const span = document.createElement("span");
        selectSpan.appendChild(span);
        if (selectCatCount !== 1) {
            span.insertAdjacentText("beforeend", " or ");
        }
        const select = document.createElement("select");
        span.appendChild(select);
        select.insertAdjacentHTML("beforeend", `<option value='-' selected>-</option>`);
        if (wordCategories) wordCategories.forEach(o => select.insertAdjacentHTML("beforeend", `<option value='${o.ID}'>${o.Name}</option>`));
        const btn = document.createElement("button");
        span.appendChild(btn);
        btn.innerText = 'X';
        btn.addEventListener("click", () => {
            if (selectCatCount > 1) {
                span.remove();
                selectCatCount--;
            } else {
                select.value = '-';
            }
        });
    };
    td = document.createElement("td");
    const selectSpan = document.createElement("span");
    let selectCatCount = 0;
    td.appendChild(selectSpan);
    createSelectCat();
    td.insertAdjacentHTML("beforeend", " | ");
    const btnCreateCatSelect = document.createElement("button");
    btnCreateCatSelect.innerText = "+";
    btnCreateCatSelect.addEventListener("click", createSelectCat);
    td.appendChild(btnCreateCatSelect);
    tr.appendChild(td);

    // Show certain columns
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strongExtra Info</strong></td>");
    td = document.createElement('td');
    tr.appendChild(td);
    const checkboxAllowSpeak = document.createElement('input');
    checkboxAllowSpeak.type = "checkbox";
    checkboxAllowSpeak.checked = true;
    td.insertAdjacentHTML("beforeend", "Speak&nbsp;");
    td.appendChild(checkboxAllowSpeak);
    const checkboxShowPhrases = document.createElement('input');
    checkboxShowPhrases.type = "checkbox";
    checkboxShowPhrases.checked = true;
    td.insertAdjacentHTML("beforeend", "| Phrases&nbsp;");
    td.appendChild(checkboxShowPhrases);
    const checkboxShowCategory = document.createElement('input');
    checkboxShowCategory.type = 'checkbox';
    checkboxShowCategory.checked = false;
    td.insertAdjacentHTML("beforeend", "| Word Category&nbsp;");
    td.appendChild(checkboxShowCategory);

    // Create
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    td = document.createElement('td');
    tr.appendChild(td);
    td.setAttribute('colspan', 2);
    const btnGo = document.createElement('button');
    td.appendChild(btnGo);
    btnGo.innerText = 'Create Test';
    btnGo.addEventListener('click', () => {
        const wordCat = Array.from(selectSpan.querySelectorAll("select")).map(e => +e.value).filter(n => !isNaN(n));
        const test = [], count = +inputPhraseCount.value;
        const available = allPhrases.filter(o => {
            // return (wordCat.length === 0 ? true : wordCat.filter(n => o.Cat.indexOf(n) === -1).length === 0);
            return (wordCat.length === 0 ? true : o.Cat.some(c => wordCat.includes(c)));
        });
        while (test.length < count && available.length > 0) {
            const idx = Math.floor(Math.random() * available.length);
            const word = available[idx];
            available.splice(idx, 1);
            if (!test.includes(word)) {
                test.push(word);
            }
        }
        populateTest(test, +selectType.value, checkboxAllowSpeak.checked, checkboxShowPhrases.checked, checkboxShowCategory.checked);
    });
}

// List test words
function populateTest(phrases, testType, allowSpeak = true, showWords = true, showCategory = true) {
    divTest.innerHTML = "";
    const table = document.createElement("table");
    divTest.appendChild(table);
    table.classList.add("border");
    const thead = document.createElement("thead");
    table.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let colspan = 2;
    tr.insertAdjacentHTML("beforeend", "<th>Italiano</th>");
    tr.insertAdjacentHTML("beforeend", "<th>Inglese</th>");
    if (showCategory) {
        tr.insertAdjacentHTML("beforeend", "<th>Word Category</th>");
        colspan++;
    }

    const tbody = table.createTBody();
    const inputs = [];
    for (const word of phrases) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        let input, td;

        td = document.createElement("td");
        if (allowSpeak && testType !== TYPE_EN_IT) {
            const btnSpeak = document.createElement("span");
            btnSpeak.innerHTML = "&#x1f50a;";
            btnSpeak.classList.add("link", "no-underline");
            btnSpeak.addEventListener('click', () => speak(word.It, "it-IT"));
            td.appendChild(btnSpeak);
            td.insertAdjacentHTML("beforeend", " &nbsp;");
        }
        if (testType === TYPE_EN_IT || testType === TYPE_IT_SPEECH) {
            input = document.createElement("input");
            input.type = "text";
            td.appendChild(input);
        } else {
            if (showWords) td.insertAdjacentText("beforeend", word.It);
        }
        tr.appendChild(td);

        td = document.createElement("td");
        if (testType === TYPE_IT_EN) {
            input = document.createElement("input");
            input.type = "text";
            td.appendChild(input);
        } else {
            if (allowSpeak) {
                const btnSpeak = document.createElement("span");
                btnSpeak.innerHTML = "&#x1f50a;";
                btnSpeak.classList.add("link", "no-underline");
                btnSpeak.addEventListener('click', () => speak(word.En.join(", or "), "en-GB"));
                td.appendChild(btnSpeak);
                td.insertAdjacentHTML("beforeend", " &nbsp;");
            }
            if (showWords) td.insertAdjacentHTML("beforeend", word.En.map(en => "<em>" + en + "</em>").join(", "));
        }
        tr.appendChild(td);

        if (showCategory) {
            td = document.createElement("td");
            const catNames = word.Cat.map(c => wordCategories.find(C => C.ID === c).Name);
            td.insertAdjacentHTML("beforeend", catNames.map((n, i) => `<em>${n}</em>`).join(", "));
            tr.appendChild(td);
        }

        inputs.push(input);
    }

    const tfoot = table.createTFoot();
    tr = document.createElement('tr');
    tfoot.appendChild(tr);
    td = document.createElement('td');
    tr.appendChild(td);
    const btnMark = document.createElement('button');
    btnMark.innerText = "Mark";
    btnMark.addEventListener("click", () => {
        let correct = 0;
        const rows = tbody.querySelectorAll('tr');
        for (let i = 0; i < phrases.length; i++) {
            const value = inputs[i].value.trim().toLowerCase(), word = phrases[i];
            let ok = false;
            switch (testType) {
                case TYPE_IT_EN:
                    ok = word.En.some(en => removePunctuation(removeSpaces(value)) === removePunctuation(removeSpaces(en)));
                    break;
                case TYPE_EN_IT:
                case TYPE_IT_SPEECH:
                    ok = removePunctuation(removeSpaces(word.It)) === removePunctuation(removeSpaces(value));
                    break;
                case TYPE_GENDER:
                    ok = word.Gender === value;
                    break;
            }

            let td = document.createElement('td');
            rows[i].appendChild(td);
            if (ok) {
                correct++;
                td.insertAdjacentHTML("beforeend", `<span class='green'><strong>${check}</strong></span>`);
            } else {
                let content = '';
                switch (testType) {
                    case TYPE_IT_EN:
                        content = word.En.map(x => "<em>" + x + "</em>").join(", ");
                        break;
                    case TYPE_EN_IT:
                    case TYPE_IT_SPEECH:
                        content = "<em>" + word.It + "</em>";
                        break;
                }
                td.insertAdjacentHTML("beforeend", `<span class='red'><strong>${cross}</strong> - ${content}</span>`);
            }
        }
        let p = correct / phrases.length * 100, klass = p > 50 ? 'green' : 'red';
        markTD.innerHTML = ` &nbsp;<span class='${klass}'>${correct}/${phrases.length} - ${Math.round(p)}%</span>`;
    });
    td.appendChild(btnMark);
    const markTD = document.createElement("td");
    markTD.setAttribute("colspan", colspan);
    tr.appendChild(markTD);
}

// Socket
const socket = io();

var _recv = 0;
function incRecieved() {
    _recv += 1;
    if (_recv === 3) socket.emit("get-phrases");
}

socket.on("get-word-categories", array => {
    wordCategories = array.sort((a, b) => a.Name.localeCompare(b.Name));;
    incRecieved();
});
socket.on("get-phrases", array => {
    allPhrases = array;
    allPhrases = allPhrases.map(o => {
        o.En = o.En.split(",");
        o.Cat = o.Cat ? o.Cat.split(",").map(n => +n) : [];
        return o;
    }).sort((a, b) => a.It.localeCompare(b.It));
    loadConfig();
});

socket.emit("get-word-categories");
socket.emit("get-phrases");
