const inputIt = document.getElementById("inp-it");
const inputEn = document.getElementById("inp-en");
const selectGender = document.getElementById("sel-gender");
const selectClasses = document.getElementById("sel-class");
const spanClasses = document.getElementById("span-class");
const selectCategories = document.getElementById("sel-cats");
const spanCategories = document.getElementById("span-cats");
const textareaComment = document.getElementById("txt-comment");
const btnCreate = document.getElementById("btn-create");
const classes = new Set(), categories = new Set();
var wordClasses, wordCategories;

const socket = io();
socket.on("get-word-classes", array => {
    selectClasses.innerHTML = "";
    wordClasses = array.sort((a, b) => a.Name.localeCompare(b.Name));
    selectClasses.insertAdjacentHTML("beforeend", `<option value='NIL' selected disabled>-</option>`);
    for (const klass of array) {
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

selectClasses.addEventListener("change", () => {
    const id = +selectClasses.value;
    if (!isNaN(id)) {
        classes.add(id);
        showWordClasses();
    }
    selectClasses.value = "NIL";
});

selectCategories.addEventListener("change", () => {
    const id = +selectCategories.value;
    if (!isNaN(id)) {
        categories.add(id);
        showWordCategories();
    }
    selectCategories.value = "NIL";
});

function showWordClasses() {
    spanClasses.innerHTML = "";
    classes.forEach(id => {
        const obj = wordClasses.find(x => x.ID === id);
        spanClasses.insertAdjacentHTML("beforeend", `<span title='${obj.Desc}'>${obj.Name}</span> `);
        let del = document.createElement("button");
        del.innerText = 'X';
        del.addEventListener("click", () => {
            classes.delete(id);
            showWordClasses();
        });
        spanClasses.appendChild(del);
        spanClasses.insertAdjacentHTML("beforeend", ` |`);
    });
}

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

function createWord() {
    const data = {};
    data.It = inputIt.value.trim();
    data.En = inputEn.value.trim().split(",").map(x => x.trim());
    data.Gender = selectGender.value;
    data.Class = Array.from(classes.values());
    data.Cat = Array.from(categories.values());
    data.Comment = textareaComment.value.trim();
    socket.emit("create-word", data);
}

btnCreate.addEventListener("click", createWord);
document.body.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === 'Enter') createWord();
});

socket.on("alert", text => {
    window.alert(text);
});
socket.on("create-word", id => {
    alert(`Created word. ID: ${id}`);
    inputIt.value = "";
    inputEn.value = "";
    textareaComment.value = "";
});

socket.emit("get-word-classes");
socket.emit("get-word-categories");