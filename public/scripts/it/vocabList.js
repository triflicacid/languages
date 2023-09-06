const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
var wordClasses, wordCategories, phrases;
var htmlRows = [], hiddenRows = [];

function populateTBody(words) {
    tbody.innerHTML = "";
    tbody.insertAdjacentHTML("beforeend", `<tr><th colspan="10">Words: ${words.length.toLocaleString("en-GB")}</th></tr>`);
    htmlRows.length = 0;
    for (const word of words) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        htmlRows.push(tr);

        td = document.createElement("td");
        if (hiddenRows.includes(0)) td.classList.add("hide");
        // SPEAK button
        const btnSpeak = document.createElement("span");
        btnSpeak.classList.add("link", "no-underline");
        btnSpeak.innerHTML = "&#x1f50a;";
        btnSpeak.addEventListener("click", () => speak(word.It));
        td.appendChild(btnSpeak);
        td.insertAdjacentHTML("beforeend", " &nbsp;");
        // ITALIAN word
        const linkIt = document.createElement("a");
        linkIt.innerText = word.It;
        linkIt.href = "./word.html?id=" + word.ID;
        td.appendChild(linkIt);
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(1)) td.classList.add("hide");
        td.insertAdjacentHTML("beforeend", word.En.split(",").map(en => "<em>" + en + "</em>").join(", "));
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(2)) td.classList.add("hide");
        if (word.ItPlural) td.insertAdjacentHTML("beforeend", word.ItPlural);
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(3)) td.classList.add("hide");
        let gender = "";
        if (word.Gender === "M") gender = "Masculine";
        if (word.Gender === "F") gender = "Feminine";
        td.insertAdjacentHTML("beforeend", gender);
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(4)) td.classList.add("hide");
        const classNames = word.Class.map(c => wordClasses.find(C => C.ID === c).Name);
        td.insertAdjacentHTML("beforeend", classNames.map(n => "<em>" + n + "</em>").join(", "));
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(5)) td.classList.add("hide");
        const catNames = word.Cat.map(c => wordCategories.find(C => C.ID === c).Name);
        td.insertAdjacentHTML("beforeend", catNames.map((n, i) => `<em>${n}</em>`).join(", "));
        tr.appendChild(td);

        td = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            tr.querySelectorAll("td").forEach(e => e.classList.toggle("hide"));
        });
        td.appendChild(checkbox);
        tr.appendChild(td);
    }
}

function searchWords(It, En, Gender, Class, Cat) {
    Cat = Cat.filter(x => !isNaN(x));
    let filtered = phrases.filter(word => {
        return (It ? word.It.indexOf(It) !== -1 : true) &&
            (En ? word.En.indexOf(En) !== -1 : true) &&
            (Class ? word.Class.some(c => c === Class) : true) &&
            (Gender === undefined ? true : Gender === word.Gender) &&
            // (Cat.length === 0 ? true : Cat.filter(n => word.Cat.indexOf(n) === -1).length === 0);
            (Cat.length === 0 ? true : word.Cat.some(c => Cat.includes(c)));
    });
    populateTBody(filtered);
}

let loadedHead = false;
function loadTHead() {
    if (loadedHead) return;
    loadedHead = true;

    const firstRow = thead.children[0];
    for (let i = 0; i < firstRow.children.length - 1; i++) {
        const tr = firstRow.children[i];
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                hiddenRows.push(i);
                for (let row of htmlRows) row.children[i].classList.add("hide");
            } else {
                hiddenRows.splice(hiddenRows.indexOf(i), 1);
                for (let row of htmlRows) row.children[i].classList.remove("hide");
            }
        });
        tr.insertAdjacentElement("afterbegin", checkbox);
    }

    function search() {
        searchWords(
            inputIt.value,
            inputEn.value,
            selectGender.value === '-' ? undefined : selectGender.value,
            selectClass.value === '' ? undefined : +selectClass.value,
            Array.from(selectSpan.querySelectorAll("select")).map(e => +e.value)
        );
    }

    const tr = document.createElement("tr");
    thead.appendChild(tr);

    let td = document.createElement("td");
    const inputIt = document.createElement("input");
    inputIt.placeholder = "Search";
    inputIt.addEventListener("input", search);
    td.appendChild(inputIt);
    tr.appendChild(td);

    td = document.createElement("td");
    const inputEn = document.createElement("input");
    inputEn.placeholder = "Search";
    inputEn.addEventListener("input", search);
    td.appendChild(inputEn);
    tr.appendChild(td);

    td = document.createElement("td");
    tr.appendChild(td);

    td = document.createElement("td");
    const selectGender = document.createElement("select");
    selectGender.insertAdjacentHTML("beforeend", "<option value='-'>-</option>");
    selectGender.insertAdjacentHTML("beforeend", "<option value=''>(None)</option>");
    selectGender.insertAdjacentHTML("beforeend", "<option value='M'>Masculine</option>");
    selectGender.insertAdjacentHTML("beforeend", "<option value='F'>Feminine</option>");
    selectGender.addEventListener("input", search);
    td.appendChild(selectGender);
    tr.appendChild(td);

    td = document.createElement("td");
    const selectClass = document.createElement("select");
    selectClass.insertAdjacentHTML("beforeend", "<option value=''>-</option>");
    wordClasses.forEach(o => selectClass.insertAdjacentHTML("beforeend", `<option value='${o.ID}'>${o.Name}</option>`));
    selectClass.addEventListener("input", search);
    td.appendChild(selectClass);
    tr.appendChild(td);

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
        wordCategories.forEach(o => select.insertAdjacentHTML("beforeend", `<option value='${o.ID}'>${o.Name}</option>`));
        select.addEventListener("change", search);
        const btn = document.createElement("button");
        span.appendChild(btn);
        btn.innerText = 'X';
        btn.addEventListener("click", () => {
            if (selectCatCount > 1) {
                span.remove();
                selectCatCount--;
                search();
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
}

const socket = io();

var _recv = 0;
function incRecieved() {
    _recv += 1;
    if (_recv === 2) socket.emit("get-words");
}

socket.on("get-word-classes", array => {
    wordClasses = array.sort((a, b) => a.Name.localeCompare(b.Name));
    incRecieved();
});
socket.on("get-word-categories", array => {
    wordCategories = array.sort((a, b) => a.Name.localeCompare(b.Name));
    incRecieved();
});
socket.on("get-words", array => {
    phrases = array;
    phrases = phrases.map(o => {
        o.Cat = o.Cat ? o.Cat.split(",").map(n => +n) : [];
        o.Class = o.Class ? o.Class.split(",").map(n => +n) : [];
        o.Gender = o.Gender || "";
        return o;
    }).sort((a, b) => a.It.localeCompare(b.It));
    populateTBody(phrases);
    loadTHead();
});

socket.emit("get-word-classes");
socket.emit("get-word-categories");
socket.emit("get-words");