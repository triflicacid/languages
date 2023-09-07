const inputIt = document.getElementById("inp-it");
const inputItPlural = document.getElementById("inp-it-pl");
const inputEn = document.getElementById("inp-en");
const selectGender = document.getElementById("sel-gender");
const selectClasses = document.getElementById("sel-class");
const spanClasses = document.getElementById("span-class");
const selectCategories = document.getElementById("sel-cats");
const spanCategories = document.getElementById("span-cats");
const textareaComment = document.getElementById("txt-comment");
const divIrregular = document.getElementById("div-irregular-verb");
divIrregular.setAttribute("hidden", "hidden");
var irregVerbID;
const classes = new Set(), categories = new Set();
var wordClasses, wordCategories;

document.getElementById("btn-back").addEventListener("click", () => {
    window.history.back();
});

const socket = connectToSocket();
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
    socket.emit("update-word", { ID, It: inputIt.value.trim() });
});

inputItPlural.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, ItPlural: inputItPlural.value.trim() });
});

inputEn.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, En: inputEn.value.trim() });
});

selectGender.addEventListener("change", () => {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Gender: selectGender.value });
});

selectClasses.addEventListener("change", () => {
    const id = +selectClasses.value;
    if (!isNaN(id)) {
        classes.add(id);
        if (id === irregVerbID) {
            socket.emit("create-irreg-verb-info", ID);
            divIrregular.removeAttribute("hidden");
        }
        updateWordClasses();
        showWordClasses();
    }
    selectClasses.value = "NIL";
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
    socket.emit("update-word", { ID, Comment: textareaComment.value });
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
            if (id === irregVerbID) {
                divIrregular.setAttribute("hidden", "hidden");
                socket.emit("delete-irreg-verb-info", ID);
                for (const el of document.querySelectorAll(".inp-iv")) el.value = '';
            }
            updateWordClasses();
            showWordClasses();
        });
        spanClasses.appendChild(del);
        spanClasses.insertAdjacentHTML("beforeend", ` |`);
    });
}

function updateWordClasses() {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Class: Array.from(classes.values()) });
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
            updateWordCategories();
            showWordCategories();
        });
        spanCategories.appendChild(del);
        spanCategories.insertAdjacentHTML("beforeend", ` |`);
    });
}

function updateWordCategories() {
    if (!ok) return console.warn("Cannot update; OK=false");
    socket.emit("update-word", { ID, Cat: Array.from(categories.values()) });
}

function clear() {
    inputIt.value = "";
    inputItPlural.value = "";
    inputEn.value = "";
    spanClasses.innerHTML = "";
    spanCategories.innerHTML = "";
    classes.clear();
    categories.clear();
    textareaComment.value = "";
    const elements = document.querySelectorAll(".inp-iv");
    for (let element of elements) element.value = "";
    divIrregular.setAttribute("hidden", "hidden");
}

socket.on("alert", text => {
    window.alert(text);
});
socket.on("get-word-raw", obj => {
    if (obj == null) {
        ok = false;
        alert(`No word found for the given query -- '${query}'.`);
        window.location.href = "./";
    } else {
        ID = obj.ID;
        ok = true;

        inputIt.value = obj.It || "";
        inputItPlural.value = obj.ItPlural || "";
        inputEn.value = obj.En || "";
        selectGender.value = obj.Gender || "";
        textareaComment.value = obj.Comment || "";
        obj.Class = obj.Class || "";
        obj.Cat = obj.Cat || "";

        classes.clear();
        const classList = obj.Class.trim().split(",").map(x => x.trim()).filter(x => x.length > 0).map(n => +n);
        classList.forEach(id => classes.add(id));
        showWordClasses();
        const isIrregular = classList.includes(irregVerbID);
        if (isIrregular) { // IRREGULAR VERB
            divIrregular.removeAttribute("hidden");
        }
        const elements = document.querySelectorAll(".inp-iv");
        for (let element of elements) {
            const name = element.getAttribute("name");
            if (isIrregular) element.value = obj.Verb[name] ?? "";
            element.addEventListener("change", () => socket.emit("update-word", { ID, Verb: { [name]: element.value.trim() } }));
        }

        categories.clear();
        obj.Cat.trim().split(",").map(x => x.trim()).filter(x => x.length > 0).forEach(id => categories.add(+id));
        showWordCategories();
    }
});

socket.emit("get-word-classes");
socket.emit("get-word-categories");

const params = new URLSearchParams(location.search);
var ID = params.get("id"), query, ok = true;
if (ID == undefined) {
    query = prompt("Enter the ID or the Italian of the word to edit");
} else {
    query = +ID;
}
socket.emit("get-word-raw", { query, verb: true });