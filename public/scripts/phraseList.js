const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
var wordCategories, phrases;
var htmlRows = [], hiddenRows = [];

function populateTBody(phrases) {
    tbody.innerHTML = "";
    tbody.insertAdjacentHTML("beforeend", `<tr><th colspan="10">Words: ${phrases.length.toLocaleString("en-GB")}</th></tr>`);
    htmlRows.length = 0;
    for (const phrase of phrases) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        htmlRows.push(tr);

        td = document.createElement("td");
        if (hiddenRows.includes(0)) td.classList.add("hide");
        // SPEAK button
        const btnSpeak = document.createElement("span");
        btnSpeak.classList.add("link", "no-underline");
        btnSpeak.innerHTML = "&#x1f50a;";
        btnSpeak.addEventListener("click", () => speak(phrase.It));
        td.appendChild(btnSpeak);
        td.insertAdjacentHTML("beforeend", " &nbsp;");
        // ITALIAN phrase
        const linkIt = document.createElement("a");
        linkIt.innerText = phrase.It;
        linkIt.href = "./phrase.html?id=" + phrase.ID;
        td.appendChild(linkIt);
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(1)) td.classList.add("hide");
        td.insertAdjacentHTML("beforeend", phrase.En.split(",").map(en => "<em>" + en + "</em>").join(", "));
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(2)) td.classList.add("hide");
        const catNames = phrase.Cat.map(c => wordCategories.find(C => C.ID === c).Name);
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

function searchPhrases(It, En, Cat) {
    Cat = Cat.filter(x => !isNaN(x));
    let filtered = phrases.filter(word => {
        return (It ? word.It.indexOf(It) !== -1 : true) &&
            (En ? word.En.indexOf(En) !== -1 : true) &&
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
        searchPhrases(
            inputIt.value,
            inputEn.value,
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
    wordCategories = array.sort((a, b) => a.Name.localeCompare(b.Name));;
    incRecieved();
});
socket.on("get-phrases", array => {
    phrases = array;
    phrases = phrases.map(o => {
        o.Cat = o.Cat ? o.Cat.split(",").map(n => +n) : [];
        return o;
    }).sort((a, b) => a.It.localeCompare(b.It));
    populateTBody(phrases);
    loadTHead();
});

socket.emit("get-word-categories");
socket.emit("get-phrases");