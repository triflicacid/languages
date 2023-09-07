const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
const btnNew = document.getElementById("btn-new");
var allWords;

function populateTBody(words) {
    tbody.innerHTML = "";
    tbody.insertAdjacentHTML("beforeend", `<tr><th colspan="10">Words: ${words.length.toLocaleString("en-GB")}</th></tr>`);
    for (const word of words) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        let td = document.createElement("td");
        const inputSv = document.createElement("input");
        inputSv.value = word.Word;
        inputSv.addEventListener("change", () => {
            word.Word = inputSv.value.trim();
            socket.emit("update-word", { ID: word.ID, Word: word.Word });
        });
        td.appendChild(inputSv);
        tr.appendChild(td);

        td = document.createElement("td");
        const inputEn = document.createElement("input");
        inputEn.value = word.En;
        inputEn.addEventListener("change", () => {
            word.En = inputEn.value.trim();
            socket.emit("update-word", { ID: word.ID, En: word.En });
        });
        td.appendChild(inputEn);
        tr.appendChild(td);

        td = document.createElement("td");
        const InputPl = document.createElement("input");
        InputPl.value = word.Plural.trim();
        InputPl.addEventListener("change", () => {
            word.Plural = InputPl.value;
            socket.emit("update-word", { ID: word.ID, Plural: word.Plural });
        });
        td.appendChild(InputPl);
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
        const inputTags = document.createElement("input");
        inputTags.value = word.Tags;
        inputTags.addEventListener("change", () => {
            word.Tags = inputTags.value;
            socket.emit("update-word", { ID: word.ID, Tags: word.Tags });
        });
        td.appendChild(inputTags);
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

function searchWords(Sv, En, Gender, Classes, Tags) {
    console.log(allWords)
    let filtered = allWords.filter(word => {
        return (Sv ? word.Word.includes(Sv) : true) &&
            (En ? word.En.includes(En) : true) &&
            (Classes ? word.Class.contains(Classes) : true) &&
            (Gender ? Gender === word.Gender : true) &&
            (Tags ? word.Tags.contains(Tags) : true);
    });
    populateTBody(filtered);
}

btnNew.addEventListener("click", () => {
    window.location.href = "./newVocab.html";
});

(function () {
    function search() {
        searchWords(...inputs.map(e => e.value));
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

const socket = connectToSocket();
socket.on("get-words", array => {
    allWords = array;
    populateTBody(allWords);
});

socket.emit("get-words");