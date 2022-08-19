const divConfig = document.getElementById('test-config');
const divTest = document.getElementById('test-body');
var wordClasses, wordCategories, allWords;
const check = "&#10003;", cross = "&#10008;";

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

    // Translation direction
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Translation Direction</strong></td>");
    td = document.createElement('td');
    tr.appendChild(td);
    const radioIt2En = document.createElement('input');
    radioIt2En.type = 'radio';
    radioIt2En.name = 'trans-dir';
    radioIt2En.checked = true;
    td.appendChild(radioIt2En);
    td.insertAdjacentHTML("beforeend", "It &rarr; En &nbsp;");
    const radioEn2It = document.createElement('input');
    radioEn2It.type = 'radio';
    radioEn2It.name = radioIt2En.name;
    td.appendChild(radioEn2It);
    td.insertAdjacentHTML("beforeend", "En &rarr; It &nbsp;");

    // Word class
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.insertAdjacentHTML("beforeend", "<td><strong>Word Class</strong></td>");
    td = document.createElement('td');
    const selectClass = document.createElement('select');
    td.appendChild(selectClass);
    selectClass.insertAdjacentHTML("beforeend", "<option value='-'>-</option>");
    wordClasses.forEach(o => selectClass.insertAdjacentHTML("beforeend", `<option value='${o.ID}'>${o.Name}</option>`));
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
            span.insertAdjacentHTML("beforeend", " &amp; ");
        }
        const select = document.createElement("select");
        span.appendChild(select);
        select.insertAdjacentHTML("beforeend", `<option value='-' selected>-</option>`);
        wordCategories.forEach(o => select.insertAdjacentHTML("beforeend", `<option value='${o.ID}'>${o.Name}</option>`));
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
    tr.insertAdjacentHTML("beforeend", "<td><strong>Show Extra Info</strong></td>");
    td = document.createElement('td');
    tr.appendChild(td);
    const checkboxShowClass = document.createElement('input');
    checkboxShowClass.type = 'checkbox';
    checkboxShowClass.checked = true;
    td.insertAdjacentHTML("beforeend", "Word Class&nbsp;");
    td.appendChild(checkboxShowClass);
    const checkboxShowCategory = document.createElement('input');
    checkboxShowCategory.type = 'checkbox';
    checkboxShowCategory.checked = true;
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
        const available = allWords.filter(o => {
            return (wordClass === undefined ? true : o.Class.some(n => n === wordClass)) &&   
                (wordCat.length === 0 ? true : wordCat.filter(n => o.Cat.indexOf(n) === -1).length === 0);   
        });
        let i = 0;
        while (test.length < count && test.length < available.length) {
            const idx = Math.floor(Math.random() * available.length);
            const word = available[idx];
            available.splice(idx, 1);
            if (!test.includes(word)) {
                test.push(word);
            }
        }
        populateTest(test, radioIt2En.checked, checkboxShowClass.checked, checkboxShowCategory.checked);
    });
}

// List test words
function populateTest(words, it2en, showClass = true, showCategory = true) {
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

        const wordInput = document.createElement("input");
        wordInput.type = "text";
        inputs.push(wordInput);

        let td = document.createElement("td");
        if (it2en) {
            td.insertAdjacentText("beforeend", word.It);
        } else {
            td.appendChild(wordInput);
        }
        tr.appendChild(td);

        td = document.createElement("td");
        if (it2en) {
            td.appendChild(wordInput);
        } else {
            td.insertAdjacentHTML("beforeend", word.En.map(en => "<em>" + en + "</em>").join(", "));
        }
        tr.appendChild(td);
        
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
            const value = inputs[i].value.trim(), word = words[i];
            let ok = false;
            if (it2en) {
                ok = word.En.some(en => value === en);
            } else {
                ok = word.It === value;
            }

            let td = document.createElement('td');
            rows[i].appendChild(td);
            if (ok) {
                correct++;
                td.insertAdjacentHTML("beforeend", `<span class='green'><strong>${check}</strong></span>`);
            } else {
                let content = it2en ? word.En.map(x => "<em>" + x + "</em>").join(", ") : "<em>" + word.It + "</em>";
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
    allWords = array;
    allWords = allWords.map(o => {
        o.En = o.En.split(",");
        o.Cat = o.Cat.split(",").map(n => +n);
        o.Class = o.Class.split(",").map(n => +n);
        return o;
    }).sort((a, b) => a.It.localeCompare(b.It));
    loadConfig();
});

socket.emit("get-word-classes");
socket.emit("get-word-categories");
socket.emit("get-words");
