const divConfig = document.getElementById('test-config');
const divTest = document.getElementById('test-body');
var allWords;
const check = "&#10003;", cross = "&#10008;";

const TYPE_SV_EN = 1;
const TYPE_EN_SV = 2;
const TYPE_GENDER = 3;
const TYPE_SV_SPEECH = 4;

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
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_SV_EN}">Swedish &rarr; English</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_EN_SV}">English &rarr; Swedish</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_GENDER}">Gender</option>`);
    selectType.insertAdjacentHTML("beforeend", `<option value="${TYPE_SV_SPEECH}">Swedish from Pronunctiation</option>`);
    td.appendChild(selectType);

    // Word class
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Word Class</strong></td>");
    td = document.createElement('td');
    const inputClass = document.createElement('input');
    td.appendChild(inputClass);
    tr.appendChild(td);

    // Word category
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Tags</strong></td>");
    td = document.createElement("td");
    const inputTags = document.createElement('input');
    td.appendChild(inputTags);
    tr.appendChild(td);

    // Show certain columns
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Extra Info</strong></td>");
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
    const checkboxShowTags = document.createElement('input');
    checkboxShowTags.type = 'checkbox';
    checkboxShowTags.checked = false;
    td.insertAdjacentHTML("beforeend", "| Tags&nbsp;");
    td.appendChild(checkboxShowTags);

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
        const wordClass = inputClass.value.trim();
        const tags = inputTags.value.split(",").map(x => x.trim()).filter(x => x);
        const test = [], count = +inputWordCount.value;
        const available = allWords.filter(o => {
            return (wordClass.length === 0 ? true : o.Class.some(n => n === wordClass)) &&
                (tags.length === 0 ? true : o.Tags.some(c => tags.includes(c)));
        });
        while (test.length < count && available.length > 0) {
            const idx = Math.floor(Math.random() * available.length);
            const word = available[idx];
            available.splice(idx, 1);
            if (!test.includes(word)) {
                test.push(word);
            }
        }
        populateTest(test, +selectType.value, checkboxAllowSpeak.checked, checkboxShowWords.checked, checkboxShowGender.checked, checkboxShowClass.checked, checkboxShowTags.checked);
    });
}

// List test words
function populateTest(words, testType, allowSpeak = true, showWords = true, showGender = true, showClass = true, showTags = true) {
    divTest.innerHTML = "";
    const table = document.createElement("table");
    divTest.appendChild(table);
    table.classList.add("border");
    const thead = document.createElement("thead");
    table.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let colspan = 2;
    tr.insertAdjacentHTML("beforeend", "<th>Svenska</th>");
    tr.insertAdjacentHTML("beforeend", "<th>Engelsk</th>");
    if (showGender || testType === TYPE_GENDER) {
        tr.insertAdjacentHTML("beforeend", "<th>Gender</th>");
        colspan++;
    }
    if (showClass) {
        tr.insertAdjacentHTML("beforeend", "<th>Word Class</th>");
        colspan++;
    }
    if (showTags) {
        tr.insertAdjacentHTML("beforeend", "<th>Tags</th>");
        colspan++;
    }

    const tbody = table.createTBody();
    const inputs = [];
    for (const word of words) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        let input, td;

        td = document.createElement("td");
        if (allowSpeak && testType !== TYPE_EN_SV) {
            const btnSpeak = document.createElement("span");
            btnSpeak.innerHTML = "&#x1f50a;";
            btnSpeak.classList.add("link", "no-underline");
            btnSpeak.addEventListener('click', () => speak(word.Word, codes.sv.lang));
            td.appendChild(btnSpeak);
            td.insertAdjacentHTML("beforeend", " &nbsp;");
        }
        if (testType === TYPE_EN_SV || testType === TYPE_SV_SPEECH) {
            input = document.createElement("input");
            input.type = "text";
            td.appendChild(input);
        } else {
            if (showWords) td.insertAdjacentText("beforeend", word.Word);
        }
        tr.appendChild(td);

        td = document.createElement("td");
        if (testType === TYPE_SV_EN) {
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
            input.insertAdjacentHTML("beforeend", `<option value='C'>Common</option>`);
            input.insertAdjacentHTML("beforeend", `<option value='N'>Neuter</option>`);
            tr.appendChild(td);
        } else if (showGender) {
            td = document.createElement("td");
            let gender = "";
            if (word.Gender === "C") gender = "Common";
            else if (word.Gender === "N") gender = "Neuter";
            td.insertAdjacentHTML("beforeend", gender);
            tr.appendChild(td);
        }

        if (showClass) {
            td = document.createElement("td");
            td.insertAdjacentHTML("beforeend", word.Class.map(n => "<em>" + n + "</em>").join(", "));
            tr.appendChild(td);
        }

        if (showTags) {
            td = document.createElement("td");
            td.insertAdjacentHTML("beforeend", word.Tags.map((n, i) => `<em>${n}</em>`).join(", "));
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
                case TYPE_SV_EN:
                    // ok = word.En.some(en => en === value);
                    ok = word.En.some(en => removePunctuation(removeSpaces(en)) === removePunctuation(removeSpaces(value)));
                    break;
                case TYPE_EN_SV:
                case TYPE_SV_SPEECH:
                    ok = removePunctuation(removeSpaces(word.Word)) === removePunctuation(removeSpaces(value));
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
                    case TYPE_SV_EN:
                        content = word.En.map(x => "<em>" + x + "</em>").join(", ");
                        break;
                    case TYPE_EN_SV:
                    case TYPE_SV_SPEECH:
                        content = "<em>" + word.Word + "</em>";
                        break;
                    case TYPE_GENDER:
                        if (word.Gender === "C") content = "Common";
                        else if (word.Gender === "N") content = "Neuter";
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
const socket = connectToSocket();

socket.on("get-words", array => {
    allWords = array;
    allWords = allWords.map(o => {
        o.En = o.En.split(",");
        o.Tags = o.Tags ? o.Tags.split(",") : [];
        o.Class = o.Class ? o.Class.split(",") : [];
        o.Gender = o.Gender || "";
        return o;
    }).sort((a, b) => a.Word.localeCompare(b.Word));
    loadConfig();
});

socket.emit("get-words");
