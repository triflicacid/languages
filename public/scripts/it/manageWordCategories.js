const tbody = document.querySelector("tbody");
var wordCats;

function populateTable(cats) {
    tbody.innerHTML = '';
    cats = cats.sort((a, b) => a.Name.localeCompare(b.Name, "en-GB")); // Sorrt alphabetically by name
    for (let cat of cats) {
        const tr = document.createElement('tr');
        tr.insertAdjacentHTML("beforeend", `<td>${cat.ID}</td>`);
        let td = document.createElement("td");
        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.value = cat.Name;
        inputName.addEventListener("change", () => {
            inputName.value = inputName.value.trim();
            socket.emit("update-word-cat", { ID: cat.ID, Name: inputName.value });
        });
        td.appendChild(inputName);
        tr.appendChild(td);
        td = document.createElement("td");
        const textarea = document.createElement("textarea");
        textarea.value = cat.Desc;
        textarea.addEventListener("change", () => {
            textarea.value = textarea.value.trim();
            socket.emit("update-word-cat", { ID: cat.ID, Desc: textarea.value });
        });
        td.appendChild(textarea);
        tr.appendChild(td);
        td = document.createElement("td");
        const btn = document.createElement("button");
        btn.innerText = "X";
        btn.addEventListener("click", () => {
            socket.emit("delete-word-cat", cat.ID);
            tr.remove();
        });
        td.appendChild(btn);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    // Insert new entry
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.setAttribute("colspan", 4);
    let btn = document.createElement("button");
    btn.innerText = "+ New";
    btn.addEventListener("click", () => {
        let name = prompt("Word class name:", "new_category");
        if (name == undefined || name === "") return;
        socket.emit("create-word-cat", { Name: name });
    });
    td.appendChild(btn);
    tr.appendChild(td);
    tbody.appendChild(tr);
}

const socket = io();
socket.on("get-word-categories", array => {
    wordCats = array;
    populateTable(array);
});
socket.on("create-word-cat", obj => {
    wordCats.push(obj);
    populateTable(wordCats);
});

socket.emit("get-word-categories");