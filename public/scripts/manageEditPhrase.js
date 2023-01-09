const inputIt = document.getElementById("inp-it");
const inputEn = document.getElementById("inp-en");
const selectCategories = document.getElementById("sel-cats");
const spanCategories = document.getElementById("span-cats");
const textareaComment = document.getElementById("txt-comment");
const categories = new Set();
var wordCategories;

document.getElementById("btn-back").addEventListener("click", () => {
    window.history.back();
});

const socket = io();
socket.on("get-word-classes", array => {
    selectClasses.innerHTML = "";
    wordClasses = array;
    selectClasses.insertAdjacentHTML("beforeend", `<option value='NIL' selected disabled>-</option>`);
    for (const klass of array) {
        if (klass.Name === "IrregVerb") irregVerbID = +klass.ID;
        selectClasses.insertAdjacentHTML("beforeend", `<option value='${klass.ID}'>${klass.Name}</option>`);
    }
});
socket.on("get-word-categories", array => {
    selectCategories.innerHTML = "";
    wordCategories = array;
    selectCategories.insertAdjacentHTML("beforeend", `<option value='NIL' selected disabled>-</option>`);
    for (const klass of array) {
        selectCategories.insertAdjacentHTML("beforeend", `<option value='${klass.ID}'>${klass.Name}</option>`);
    }
});

inputIt.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-phrase", { ID, It: inputIt.value.trim() });
});

inputEn.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-phrase", { ID, En: inputEn.value.trim() });
});

selectCategories.addEventListener("change", () => {
    const id = +selectCategories.value;
    if (!isNaN(id)) {
        categories.add(id);
        updateWordCategories();
        showWordCategories();
    }
    selectCategories.value = "NIL";
});

textareaComment.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-phrase", { ID, Comment: textareaComment.value });
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
            updateWordCategories();
            showWordCategories();
        });
        spanCategories.appendChild(del);
        spanCategories.insertAdjacentHTML("beforeend", ` |`);
    });
}

function updateWordCategories() {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-phrase", { ID, Cat: Array.from(categories.values()) });
}

function clear() {
    inputIt.value = "";
    inputEn.value = "";
    spanCategories.innerHTML = "";
    categories.clear();
    textareaComment.value = "";
}

socket.on("alert", text => {
    window.alert(text);
});
socket.on("get-phrase-raw", obj => {
    if (obj == null) {
        ok = false;
        alert(`No phrase found for the given query -- '${query}'.`);
        window.location.href = "./";
    } else {
        ID = obj.ID;
        ok = true;

        inputIt.value = obj.It || "";
        inputEn.value = obj.En || "";
        textareaComment.value = obj.Comment || "";
        obj.Cat = obj.Cat || "";

        categories.clear();
        obj.Cat.trim().split(",").map(x => x.trim()).filter(x => x.length > 0).forEach(id => categories.add(+id));
        showWordCategories();
    }
});

socket.emit("get-word-categories");

const params = new URLSearchParams(location.search);
var ID = params.get("id"), query, ok = true;
if (ID == undefined) {
    query = prompt("Enter the ID or the Italian of the phrase to edit");
} else {
    query = +ID;
}
socket.emit("get-phrase-raw", query);