const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
const btnNew = document.getElementById("btn-new");
var phrases;

function populateTBody(words) {
    tbody.innerHTML = "";
    tbody.insertAdjacentHTML("beforeend", `<tr><th colspan="10">Words: ${words.length.toLocaleString("en-GB")}</th></tr>`);
    for (const word of words) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        let td = document.createElement("td");
        const inputIt = document.createElement("input");
        inputIt.value = word.It;
        inputIt.addEventListener("change", () => {
            word.It = inputIt.value;
            socket.emit("update-word", { ID: word.ID, It: word.It });
        });
        td.appendChild(inputIt);
        tr.appendChild(td);

        td = document.createElement("td");
        const inputEn = document.createElement("input");
        inputEn.value = word.En;
        inputEn.addEventListener("change", () => {
            word.En = inputEn.value;
            socket.emit("update-word", { ID: word.ID, En: word.En });
        });
        td.appendChild(inputEn);
        tr.appendChild(td);

        td = document.createElement("td");
        const InputItPl = document.createElement("input");
        InputItPl.value = word.ItPlural;
        InputItPl.addEventListener("change", () => {
            word.ItPlural = InputItPl.value;
            socket.emit("update-word", { ID: word.ID, ItPlural: word.ItPlural });
        });
        td.appendChild(InputItPl);
        tr.appendChild(td);

        td = document.createElement("td");
        const inputGender = document.createElement("input");
        inputGender.value = word.Gender;
        inputGender.addEventListener("change", () => {
            word.Gender = inputGender.value;
            socket.emit("update-word", { ID: word.ID, Gender: word.Gender });
        });
        td.appendChild(inputGender);
        tr.appendChild(td);

        td = document.createElement("td");
        const inputClass = document.createElement("input");
        inputClass.value = word.Class;
        inputClass.addEventListener("change", () => {
            word.Class = inputClass.value;
            socket.emit("update-word", { ID: word.ID, Class: word.Class });
        });
        td.appendChild(inputClass);
        tr.appendChild(td);

        td = document.createElement("td");
        const inputCat = document.createElement("input");
        inputCat.value = word.Cat;
        inputCat.addEventListener("change", () => {
            word.Cat = inputCat.value;
            socket.emit("update-word", { ID: word.ID, Cat: word.Cat });
        });
        td.appendChild(inputCat);
        tr.appendChild(td);

        td = document.createElement("td");
        const btnEdit = document.createElement("button");
        btnEdit.innerHTML = '&#128393;';
        btnEdit.addEventListener("click", () => {
            window.location.href = "./editVocab.html?id=" + word.ID;
        });
        td.appendChild(btnEdit);
        tr.appendChild(td);
    }
}

function searchPhrases(It, En, ItPlural, Gender, Class, Cat) {
    let filtered = phrases.filter(word => {
        return (It ? word.It.indexOf(It) !== -1 : true) &&
            (En ? word.En.indexOf(En) !== -1 : true) &&
            (ItPlural ? (word.ItPlural || "").indexOf(ItPlural) !== -1 : true) &&
            (Gender ? word.Gender === Gender : true) &&
            (Class ? (word.Class || "").indexOf(Class) !== -1 : true) &&
            (Cat ? (word.Cat || "").indexOf(Cat) !== -1 : true);
    });
    populateTBody(filtered);
}

btnNew.addEventListener("click", () => {
    window.location.href = "./newVocab.html";
});

(function () {
    function search() {
        searchPhrases(...inputs.map(e => e.value));
    }

    const inputs = [];

    function addCol() {
        const td = document.createElement("td");
        const input = document.createElement("input");
        inputs.push(input);
        input.placeholder = "Search";
        input.addEventListener("input", search);
        td.appendChild(input);
        tr.appendChild(td);
    }

    const tr = document.createElement("tr");
    thead.appendChild(tr);
    for (let i = 0; i < 6; i++) addCol();
})();

const socket = io();
socket.on("get-words", array => {
    phrases = array;
    populateTBody(phrases);
});

socket.emit("get-words");