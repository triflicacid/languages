const tbody = document.querySelector("tbody");
var wordClasses;

function populateTable(classes) {
    tbody.innerHTML = '';
    classes = classes.sort((a, b) => a.Name.localeCompare(b.Name, "en-GB")); // Sorrt alphabetically by name
    for (let klass of classes) {
        const tr = document.createElement('tr');
        tr.insertAdjacentHTML("beforeend", `<td>${klass.ID}</td>`);
        let td = document.createElement("td");
        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.value = klass.Name;
        inputName.addEventListener("change", () => {
            inputName.value = inputName.value.trim();
            socket.emit("update-word-class", { ID: klass.ID, Name: inputName.value });
        });
        td.appendChild(inputName);
        tr.appendChild(td);
        td = document.createElement("td");
        const textarea = document.createElement("textarea");
        textarea.value = klass.Desc;
        textarea.addEventListener("change", () => {
            textarea.value = textarea.value.trim();
            socket.emit("update-word-class", { ID: klass.ID, Desc: textarea.value });
        });
        td.appendChild(textarea);
        tr.appendChild(td);
        td = document.createElement("td");
        const btn = document.createElement("button");
        btn.innerText = "X";
        btn.addEventListener("click", () => {
            socket.emit("delete-word-class", klass.ID);
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
        let name = prompt("Word class name:", "new_class");
        if (name == undefined || name === "") return;
        socket.emit("create-word-class", { Name: name });
    });
    td.appendChild(btn);
    tr.appendChild(td);
    tbody.appendChild(tr);
}

const socket = connectToSocket();
socket.on("get-word-classes", array => {
    wordClasses = array;
    populateTable(array);
});
socket.on("create-word-class", obj => {
    wordClasses.push(obj);
    populateTable(wordClasses);
});

socket.emit("get-word-classes");