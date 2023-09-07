const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");
const btnNew = document.getElementById("btn-new");
var phrases;

function populateTBody(phrases) {
    tbody.innerHTML = "";
    tbody.insertAdjacentHTML("beforeend", `<tr><th colspan="10">Phrases: ${phrases.length.toLocaleString("en-GB")}</th></tr>`);
    for (const phrase of phrases) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        let td = document.createElement("td");
        const inputIt = document.createElement("input");
        inputIt.value = phrase.It;
        inputIt.addEventListener("change", () => {
            phrase.It = inputIt.value;
            socket.emit("update-phrase", { ID: phrase.ID, It: phrase.It });
        });
        td.appendChild(inputIt);
        tr.appendChild(td);

        td = document.createElement("td");
        const inputEn = document.createElement("input");
        inputEn.value = phrase.En;
        inputEn.addEventListener("change", () => {
            phrase.En = inputEn.value;
            socket.emit("update-phrase", { ID: phrase.ID, En: phrase.En });
        });
        td.appendChild(inputEn);
        tr.appendChild(td);

        td = document.createElement("td");
        const inputCat = document.createElement("input");
        inputCat.value = phrase.Cat;
        inputCat.addEventListener("change", () => {
            phrase.Cat = inputCat.value;
            socket.emit("update-phrase", { ID: phrase.ID, Cat: phrase.Cat });
        });
        td.appendChild(inputCat);
        tr.appendChild(td);

        td = document.createElement("td");
        const btnEdit = document.createElement("button");
        btnEdit.innerHTML = '&#128393;';
        btnEdit.addEventListener("click", () => {
            window.location.href = "./editPhrase.html?id=" + phrase.ID;
        });
        td.appendChild(btnEdit);
        tr.appendChild(td);
    }
}

function searchPhrases(It, En, Cat) {
    let filtered = phrases.filter(phrase => {
        return (It ? phrase.It.indexOf(It.toLowerCase()) !== -1 : true) &&
            (En ? phrase.En.indexOf(En.toLowerCase()) !== -1 : true) &&
            (Cat ? (phrase.Cat || "").indexOf(Cat) !== -1 : true);
    });
    populateTBody(filtered);
}

btnNew.addEventListener("click", () => {
    window.location.href = "./newPhrase.html";
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
    for (let i = 0; i < 3; i++) addCol();
})();

const socket = connectToSocket();
socket.on("get-phrases", array => {
    phrases = array;
    populateTBody(phrases);
});

socket.emit("get-phrases");