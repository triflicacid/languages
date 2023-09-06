const divConfig = document.getElementById('test-config');
const divTest = document.getElementById('test-body');
var wordClasses, wordCategories, allPhrases;
const check = "&#10003;", cross = "&#10008;";

const TYPE_IT_EN = 1;
const TYPE_EN_IT = 2;
const TYPE_GENDER = 3;
const TYPE_IT_SPEECH = 4;

// Populate #test-config
function loadConfig() {
    let table = document.createElement('table'), tbody = table.createTBody();
    divConfig.appendChild(table);

    // Word Count
    let tr = document.createElement('tr'), td = document.createElement('td');
    tr.insertAdjacentHTML('beforeend', '<td><strong>Word Count</strong></td>');
    tbody.appendChild(tr);
    tr.appendChild(td);
    const inputWordCount = document.createElement('input');
    inputWordCount.type = "number";
    inputWordCount.min = 1;
    inputWordCount.value = 10;
    td.appendChild(inputWordCount);

    // Test type
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Test Subject</strong></td>");
    td = document.createElement('td');
    tr.appendChild(td);
    const selectType = document.createElement('select');
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_IT_EN}">Italian &rarr; English</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_EN_IT}">English &rarr; Italian</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_GENDER}">Gender</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_IT_SPEECH}">Italian from Pronunctiation</option>`);
    td.appendChild(selectType);

    // Word class
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Word Class</strong></td>");
    td = document.createElement('td');
    const selectClass = document.createElement('select');
    td.appendChild(selectClass);
    selectClass.insertAdjacentHTML("beforeend", "<option value='-'>-</option>");
    if (wordClasses) wordClasses.forEach(o => selectClass.insertAdjacentHTML("beforeend", `<option value='${o.ID}'>${o.Name}</option>`));
    tr.appendChild(td);

    // Word category
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Word Category</strong></td>");
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
    const checkboxShowWords = document.createElement('input');
    checkboxShowWords.type = "checkbox";
    checkboxShowWords.checked = true;
    td.insertAdjacentHTML("beforeend", "| Words&nbsp;");
    td.appendChild(checkboxShowWords);
    const checkboxShowGender = document.createElement('input');
    checkboxShowGender.type = 'checkbox';
    checkboxShowGender.checked = false;
    td.insertAdjacentHTML("beforeend", "| Gender&nbsp;");
    td.appendChild(checkboxShowGender);
    const checkboxShowClass = document.createElement('input');
    checkboxShowClass.type = 'checkbox';
    checkboxShowClass.checked = true;
    td.insertAdjacentHTML("beforeend", " | Word Class&nbsp;");
    td.appendChild(checkboxShowClass);
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
        const wordClass = selectClass.value === '-' ? undefined : +selectClass.value;
        const wordCat = Array.from(selectSpan.querySelectorAll("select")).map(e => +e.value).filter(n => !isNaN(n));
        const test = [], count = +inputWordCount.value;
        const available = allPhrases.filter(o => {
            return (wordClass === undefined ? true : o.Class.some(n => n === wordClass)) &&
                // (wordCat.length === 0 ? true : wordCat.filter(n => o.Cat.indexOf(n) === -1).length === 0);
                (wordCat.length === 0 ? true : o.Cat.some(c => wordCat.includes(c)));
        });
        while (test.length < count && available.length > 0) {
            const idx = Math.floor(Math.random() * available.length);
            const word = available[idx];
            available.splice(idx, 1);
            if (!test.includes(word)) {
                test.push(word);
            }
        }
        populateTest(test, +selectType.value, checkboxAllowSpeak.checked, checkboxShowWords.checked, checkboxShowGender.checked, checkboxShowClass.checked, checkboxShowCategory.checked);
    });
}

// List test words
function populateTest(words, testType, allowSpeak = true, showWords = true, showGender = true, showClass = true, showCategory = true) {
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
    if (showGender || testType === TYPE_GENDER) {
        tr.insertAdjacentHTML("beforeend", "<th>Gender</th>");
        colspan++;
    }
    if (showClass) {
        tr.insertAdjacentHTML("beforeend", "<th>Word Class</th>");
        colspan++;
    }
    if (showCategory) {
        tr.insertAdjacentHTML("beforeend", "<th>Word Category</th>");
        colspan++;
    }

    const tbody = table.createTBody();
    const inputs = [];
    for (const word of words) {
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

        if (testType === TYPE_GENDER) {
            input = document.createElement("select");
            td = document.createElement("td");
            td.appendChild(input);
            input.insertAdjacentHTML("beforeend", `<option value=''>-</option>`);
            input.insertAdjacentHTML("beforeend", `<option value='M'>Masculine</option>`);
            input.insertAdjacentHTML("beforeend", `<option value='F'>Feminine</option>`);
            tr.appendChild(td);
        } else if (showGender) {
            td = document.createElement("td");
            let gender = "";
            if (word.Gender === "M") gender = "Masculine";
            else if (word.Gender === "F") gender = "Feminine";
            td.insertAdjacentHTML("beforeend", gender);
            tr.appendChild(td);
        }

        if (showClass) {
            td = document.createElement("td");
            const classNames = word.Class.map(c => wordClasses.find(C => C.ID === c).Name);
            td.insertAdjacentHTML("beforeend", classNames.map(n => "<em>" + n + "</em>").join(", "));
            tr.appendChild(td);
        }

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
        for (let i = 0; i < words.length; i++) {
            const value = inputs[i].value.trim().toLowerCase(), word = words[i];
            let ok = false;
            switch (testType) {
                case TYPE_IT_EN:
                    // ok = word.En.some(en => en === value);
                    ok = word.En.some(en => removePunctuation(removeSpaces(en)) === removePunctuation(removeSpaces(value)));
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
                    case TYPE_GENDER:
                        if (word.Gender === "M") content = "Masculine";
                        else if (word.Gender === "F") content = "Feminine";
                        else if (word.Gender === "") content = "(None)";
                        break;
                }
                td.insertAdjacentHTML("beforeend", `<span class='red'><strong>${cross}</strong> - ${content}</span>`);
            }
        }
        let p = correct / words.length * 100, klass = p > 50 ? 'green' : 'red';
        markTD.innerHTML = ` &nbsp;<span class='${klass}'>${correct}/${words.length} - ${Math.round(p)}%</span>`;
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
    if (_recv === 3) socket.emit("get-words");
}

socket.on("get-word-classes", array => {
    wordClasses = array.sort((a, b) => a.Name.localeCompare(b.Name));
    incRecieved();
});
socket.on("get-word-categories", array => {
    wordCategories = array.sort((a, b) => a.Name.localeCompare(b.Name));;
    incRecieved();
});
socket.on("get-words", array => {
    allPhrases = array;
    allPhrases = allPhrases.map(o => {
        o.En = o.En.split(",");
        o.Cat = o.Cat ? o.Cat.split(",").map(n => +n) : [];
        o.Class = o.Class ? o.Class.split(",").map(n => +n) : [];
        o.Gender = o.Gender || "";
        return o;
    }).sort((a, b) => a.It.localeCompare(b.It));
    loadConfig();
});

socket.emit("get-word-classes");
socket.emit("get-word-categories");
socket.emit("get-words");
