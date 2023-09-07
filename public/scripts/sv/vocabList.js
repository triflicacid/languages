const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
var allWords;
var htmlRows = [], hiddenRows = [];

function populateTBody(words) {
    tbody.innerHTML = "";
    tbody.insertAdjacentHTML("beforeend", `<tr><th colspan="7">Words: ${words.length.toLocaleString("en-GB")}</th></tr>`);
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
        btnSpeak.addEventListener("click", () => speak(word.Word));
        td.appendChild(btnSpeak);
        td.insertAdjacentHTML("beforeend", " &nbsp;");
        // SWEDISH word
        const linkIt = document.createElement("a");
        linkIt.innerText = word.Word;
        linkIt.href = "./word.html?id=" + word.ID;
        td.appendChild(linkIt);
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(1)) td.classList.add("hide");
        td.insertAdjacentHTML("beforeend", word.En.split(",").map(en => "<em>" + en + "</em>").join(", "));
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(2)) td.classList.add("hide");
        if (word.Plural) td.insertAdjacentHTML("beforeend", word.Plural);
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(3)) td.classList.add("hide");
        let gender = "";
        if (word.Gender === "C") gender = "Common";
        if (word.Gender === "N") gender = "Neuter";
        td.insertAdjacentHTML("beforeend", gender);
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(4)) td.classList.add("hide");
        td.insertAdjacentHTML("beforeend", word.Class.map(n => "<em>" + n + "</em>").join(", "));
        tr.appendChild(td);

        td = document.createElement("td");
        if (hiddenRows.includes(5)) td.classList.add("hide");
        td.insertAdjacentHTML("beforeend", word.Tags.map((n, i) => `<em>${n}</em>`).join(", "));
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

function searchWords(Sv, En, Gender, Classes, Tags) {
    Tags = Tags.filter(x => !isNaN(x));
    let filtered = allWords.filter(word => {
        return (Sv ? word.Word.indexOf(Sv) !== -1 : true) &&
            (En ? word.En.indexOf(En) !== -1 : true) &&
            (Classes && Classes.length > 0 ? word.Class.some(c => Classes.some(c2 => c.startsWith(c2))) : true) &&
            (Gender === undefined ? true : Gender === word.Gender) &&
            (Tags && Tags.length > 0 ? word.Tags.some(c => Tags.some(c2 => c.startsWith(c2))) : true);
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
            inputSv.value,
            inputEn.value,
            selectGender.value === '-' ? undefined : selectGender.value,
            inputClass.value.split(",").map(s => s.trim()).filter(s => s.length > 0),
            inputTags.value.split(",").map(s => s.trim()).filter(s => s.length > 0),
        );
    }

    const tr = document.createElement("tr");
    thead.appendChild(tr);

    let td = document.createElement("td");
    const inputSv = document.createElement("input");
    inputSv.placeholder = "Search";
    inputSv.addEventListener("input", search);
    td.appendChild(inputSv);
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
    selectGender.insertAdjacentHTML("beforeend", "<option value='C'>Common</option>");
    selectGender.insertAdjacentHTML("beforeend", "<option value='N'>Neuter</option>");
    selectGender.addEventListener("input", search);
    td.appendChild(selectGender);
    tr.appendChild(td);

    td = document.createElement("td");
    const inputClass = document.createElement("input");
    inputClass.placeholder = "Class";
    inputClass.addEventListener("input", search);
    td.appendChild(inputClass);
    tr.appendChild(td);

    td = document.createElement("td");
    const inputTags = document.createElement("input");
    inputTags.placeholder = "Tags";
    inputTags.addEventListener("input", search);
    td.appendChild(inputTags);
    tr.appendChild(td);
    tr.appendChild(td);
}

const socket = connectToSocket();

socket.on("get-words", array => {
    allWords = array;
    allWords = allWords.map(o => {
        o.Tags = o.Tags ? o.Tags.split(",") : [];
        o.Class = o.Class ? o.Class.split(",") : [];
        o.Gender = o.Gender || "";
        return o;
    }).sort((a, b) => a.Word.localeCompare(b.Word));
    populateTBody(allWords);
    loadTHead();
});

socket.emit("get-words");