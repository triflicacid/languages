const inputIt = document.getElementById("inp-it");
const inputEn = document.getElementById("inp-en");
const selectCategories = document.getElementById("sel-cats");
const spanCategories = document.getElementById("span-cats");
const textareaComment = document.getElementById("txt-comment");
const btnCreate = document.getElementById("btn-create");
const classes = new Set(), categories = new Set();
var wordClasses, wordCategories;

const socket = connectToSocket();
socket.on("get-word-classes", array => {
    selectClasses.innerHTML = "";
    wordClasses = array.sort((a, b) => a.Name.localeCompare(b.Name));
    selectClasses.insertAdjacentHTML("beforeend", `<option value='NIL' selected disabled>-</option>`);
    for (const klass of array) {
        if (klass.Name === "IrregVerb") irregVerbID = +klass.ID;
        selectClasses.insertAdjacentHTML("beforeend", `<option value='${klass.ID}'>${klass.Name}</option>`);
    }
});
socket.on("get-word-categories", array => {
    selectCategories.innerHTML = "";
    wordCategories = array.sort((a, b) => a.Name.localeCompare(b.Name));
    selectCategories.insertAdjacentHTML("beforeend", `<option value='NIL' selected disabled>-</option>`);
    for (const klass of array) {
        selectCategories.insertAdjacentHTML("beforeend", `<option value='${klass.ID}'>${klass.Name}</option>`);
    }
});

socket.on("phrase-exists", it => {
    alert(`An entry for ${it} already exists.`);
    inputIt.select();
});

inputIt.addEventListener("change", () => {
    const it = inputIt.value.trim();
    if (it) socket.emit("phrase-exists", it);
});

selectCategories.addEventListener("change", () => {
    const id = +selectCategories.value;
    if (!isNaN(id)) {
        categories.add(id);
        showWordCategories();
    }
    selectCategories.value = "NIL";
});

function showWordCategories() {
    spanCategories.innerHTML = "";
    categories.forEach(id => {
        const obj = wordCategories.find(x => x.ID === id);
        spanCategories.insertAdjacentHTML("beforeend", `<span title='${obj.Desc}'>${obj.Name}</span> `);
        let del = document.createElement("button");
        del.innerText = 'X';
        del.addEventListener("click", () => {
            categories.delete(id);
            showWordCategories();
        });
        spanCategories.appendChild(del);
        spanCategories.insertAdjacentHTML("beforeend", ` |`);
    });
}

function createPhrase() {
    const data = {};
    data.It = inputIt.value.trim();
    data.En = inputEn.value.trim().split(",").map(x => x.trim());
    data.Cat = Array.from(categories.values());
    data.Comment = textareaComment.value.trim();
    console.log(data);
    socket.emit("create-phrase", data);
}

btnCreate.addEventListener("click", createPhrase);
document.body.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === 'Enter') createPhrase();
});

socket.on("alert", text => {
    window.alert(text);
});
socket.on("create-phrase", id => {
    alert(`Created phrase. ID: ${id}`);
    inputIt.value = "";
    inputEn.value = "";
    textareaComment.value = "";
    inputIt.focus();
});

socket.emit("get-word-categories");